import sgMail from '@sendgrid/mail'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'

import { Forbidden, NotFound } from '../../exceptions/ApiException'
import UserValidationModel from '../../shared/models/UserValidationRequest'
import { logger } from '../../utils/logger'
import NgoModel from '../ngo/ngo.model'
import UserModel from './user.model'
import {
    CreateUserFields,
    LoginUserFields,
    UpdateUserFields,
} from './user.validator'

// setup sgMail config
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string)

const prepareValidationEmail = ({
    from = 'vishal.n@petkonnect.com',
    to = 'vishal.n@petkonnect.com',
    subject = 'Email Verification',
    text = 'email verification',
    token,
    html = `<center><strong><i>Token: ${token} </i></strong></center>`, // eslint-disable-line @typescript-eslint/restrict-template-expressions
}) => {
    return {
        from, // Change to your verified sender
        to, // Change to your recipient
        subject,
        text,
        html,
    }
}

const secret = process.env.JWT_SECRET ?? 'JWT_SECRET'

const jwtOptions = { expiresIn: '24h' }

const logUsers = { tags: ['BACKEND', 'USER-SERVICE'] }

const projection = {
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
    deletedAt: 0,
    password: 0,
    salt: 0,
}

/** Get all of the records */
async function getAllUsers(query: Record<string, any>) {
    try {
        return await UserModel.find(
            {
                $and: [
                    query,
                    {
                        deletedAt: null,
                    },
                ],
            },
            projection,
        ).lean()
    } catch (e) {
        return Promise.reject(e)
    }
}

/** Get all of the records, including soft-deleted */
async function getAllUsersIncludeDeleted(query: Record<string, any>) {
    try {
        return await UserModel.find(query).sort({ deletedAt: 'desc' }).lean()
    } catch (e) {
        return Promise.reject(e)
    }
}

/** Get single record by id */
async function getUser({ id }: { readonly id: string }) {
    try {
        const user = await UserModel.findOne(
            {
                $and: [
                    {
                        _id: id,
                    },
                    {
                        deletedAt: null,
                    },
                ],
            },
            projection,
        ).exec()

        if (!user) throw NotFound({ caseId: 'User does not exist.' })

        await user
            .populate({ path: 'ngo', select: projection, model: NgoModel })
            .execPopulate()

        return user
    } catch (e) {
        return Promise.reject(e)
    }
}

/** Create one record */
async function createUser({ fields }: { fields: CreateUserFields }) {
    try {
        // default point set to mumbai
        if (!fields?.point)
            // eslint-disable-next-line no-param-reassign
            fields.point = {
                type: 'Point',
                coordinates: [72.87, 19.07],
            }

        if (fields?.roles && fields?.roles?.length)
            fields.roles = [...new Set([...fields.roles])] // eslint-disable-line no-param-reassign

        fields.password = await bcrypt.hash(fields.password, 10) // eslint-disable-line no-param-reassign
        const newUser = new UserModel(fields)

        const savedUser = await newUser.save()
        logger.info(`User saved: ${savedUser._id}`, logUsers)

        // after saving user, creating token for validation of email
        const token = crypto.randomBytes(20).toString('hex') // sync

        // saving in in database
        await new UserValidationModel({
            email: String(fields?.email),
            token,
            otp: Math.floor(1000 + Math.random() * 9000),
        }).save()

        // and sending it via sendgrid
        await sgMail.send(prepareValidationEmail({ token })).catch((error) =>
            logger.error(
                `sgMail failed for User: ${savedUser._id} ${error}`, // eslint-disable-line @typescript-eslint/restrict-template-expressions
                logUsers,
            ),
        )

        const {
            __v, // @ts-ignore
            createdAt, // @ts-ignore
            updatedAt, // @ts-ignore
            deletedAt,
            password,
            ...data
        } = savedUser.toObject()

        return data
    } catch (e) {
        logger.error(`User create failed ${e}`, logUsers) // eslint-disable-line @typescript-eslint/restrict-template-expressions
        return Promise.reject(e)
    }
}

/** Login */
async function loginUser({ fields }: { fields: LoginUserFields }) {
    const { email = '', password = '' } = fields

    try {
        const user = await UserModel.findOne({
            $and: [
                {
                    email: email.toLowerCase().trim(),
                },
                {
                    deletedAt: null,
                },
            ],
        }).exec()

        if (!user) throw NotFound({ caseId: 'User does not exist.' })

        const isPasswordMatching: boolean = await bcrypt.compare(
            password,
            user.password,
        )

        if (!isPasswordMatching) throw Forbidden()

        const {
            __v, // @ts-ignore
            createdAt, // @ts-ignore
            updatedAt, // @ts-ignore
            deletedAt,
            password: _,
            ...data
        } = user.toObject()

        const token = jwt.sign(data, secret, jwtOptions)

        return { token, user: data }
    } catch (e) {
        logger.error(`User login failed, ${email},`, logUsers) // eslint-disable-line @typescript-eslint/restrict-template-expressions
        return Promise.reject(e)
    }
}

/** Delete one record */
async function deleteUser({ id }: { readonly id: string }) {
    try {
        const existingUser = await UserModel.findOne({
            $and: [
                {
                    _id: id,
                },
                {
                    deletedAt: null,
                },
            ],
        }).exec()

        if (!existingUser) throw NotFound({ caseId: 'User does not exist.' })

        existingUser.deletedAt = new Date()
        existingUser.markModified('deletedAt')
        await existingUser.save()

        logger.info(`User deleted: ${existingUser._id}`, logUsers)

        const {
            __v, // @ts-ignore
            // createdAt,
            updatedAt,
            deletedAt,
            password,
            ...data
        } = existingUser.toObject()

        return data
    } catch (e) {
        logger.error(`User delete failed ${id}`, logUsers)
        return Promise.reject(e)
    }
}

/** Update one record */
async function updateUser({
    id,
    fields,
}: {
    readonly id: string
    fields: UpdateUserFields
}) {
    try {
        const existing = await UserModel.findOne({
            _id: id,
        }).exec()

        if (!existing) throw NotFound({ caseId: 'User does not exist.' })

        if (fields?.password) {
            existing.password = await bcrypt.hash(fields.password, 10)
            existing.markModified('password')
        }

        if (fields?.status) {
            existing.status = fields.status
            existing.markModified('status')
        }

        if (fields?.roles) {
            existing.roles = [...new Set([...existing.roles, ...fields.roles])]
            existing.markModified('roles')
        }

        if (fields?.phoneNumber) {
            existing.phoneNumber = fields.phoneNumber
            existing.markModified('phoneNumber')
        }

        if (fields?.alternatePhoneNumber) {
            existing.alternatePhoneNumber = fields.alternatePhoneNumber
            existing.markModified('alternatePhoneNumber')
        }

        if (fields?.point) {
            existing.point = fields.point
            existing.markModified('point')
        }

        if (fields?.firstName) {
            existing.firstName = fields.firstName
            existing.markModified('firstName')
        }

        if (fields?.lastName) {
            existing.lastName = fields.lastName
            existing.markModified('lastName')
        }

        if (fields?.occupation) {
            existing.occupation = fields.occupation
            existing.markModified('occupation')
        }

        if (fields?.dob) {
            existing.dob = fields.dob
            existing.markModified('dob')
        }

        await existing.save()
        logger.info(`User updated: ${existing._id}`, logUsers)

        const {
            __v, // @ts-ignore
            createdAt, // @ts-ignore
            updatedAt,
            deletedAt,
            password,
            ...data
        } = existing.toObject()

        return data
    } catch (e) {
        return Promise.reject(e)
    }
}

/** Update one record */
async function verifyEmail({ token }: { readonly token: string }) {
    try {
        const emailValidation = await UserValidationModel.findOne({
            $and: [
                {
                    token,
                },
                {
                    verifiedAt: null,
                },
            ],
        }).exec()

        if (!emailValidation) throw NotFound({ token: 'Token does not exist.' })

        const existingUser = await UserModel.findOne({
            email: emailValidation.email,
        }).exec()

        if (!existingUser) throw NotFound({ token: 'User does not exist.' })

        const now = new Date()

        emailValidation.verifiedAt = now
        emailValidation.markModified('verifiedAt')
        await emailValidation.save()

        existingUser.emailVerifiedAt = now
        existingUser.markModified('emailVerifiedAt')
        await existingUser.save()

        logger.info(`User verified: ${existingUser._id}`, logUsers)

        const {
            __v, // @ts-ignore
            createdAt, // @ts-ignore
            updatedAt,
            deletedAt,
            password,
            ...userData
        } = existingUser.toObject()

        const emailValidationData = emailValidation.toObject()

        return { userData, emailValidationData }
    } catch (e) {
        logger.info(`User verification failed: ${token}`, logUsers)
        return Promise.reject(e)
    }
}

/** Update one record */
async function verifyOtp({
    otp,
    phone,
}: {
    readonly otp: string
    readonly phone: string
}) {
    try {
        const existingUser = await UserModel.findOne({
            phoneNumber: phone,
        }).exec()

        if (!existingUser) throw NotFound({ token: 'User does not exist.' })

        const validation = await UserValidationModel.findOne({
            email: existingUser.email,
        }).exec()

        if (!validation) throw NotFound({ otp: 'Does not exist.' })

        if (String(validation.otp) !== String(otp))
            throw NotFound({ otp: 'Does invalid.' })

        const now = new Date()

        validation.verifiedAt = now
        validation.markModified('verifiedAt')
        await validation.save()

        existingUser.emailVerifiedAt = now
        existingUser.markModified('emailVerifiedAt')
        await existingUser.save()

        logger.info(`User verified: ${existingUser._id}`, logUsers)

        const {
            __v, // @ts-ignore
            createdAt, // @ts-ignore
            updatedAt,
            deletedAt,
            password,
            ...userData
        } = existingUser.toObject()

        const emailValidationData = validation.toObject()

        return { userData, emailValidationData }
    } catch (e) {
        logger.info(`User verification failed: ${otp} ${phone}`, logUsers)
        return Promise.reject(e)
    }
}

/** Service */
function userService() {
    return {
        getAllUsers,
        getUser,
        createUser,
        deleteUser,
        updateUser,
        getAllUsersIncludeDeleted,
        loginUser,
        verifyEmail,
        verifyOtp,
    }
}

export default userService
