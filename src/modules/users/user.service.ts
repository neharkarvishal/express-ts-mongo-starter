import bcrypt from 'bcrypt'

import { NotFound } from '../../exceptions/ApiException'
import { logger } from '../../utils/logger'
import { UserInterface } from './user.interface'
import UserModel from './user.model'

const logUsers = { tags: ['BACKEND', 'CASE-SERVICE'] }
const projection = {
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
    deletedAt: 0,
    password: 0,
    salt: 0,
}

/** Get all of the records */
async function getAllUsers(query: Record<string, any>): Promise<UserInterface[]> {
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
async function getAllUsersIncludeDeleted(
    query: Record<string, any>,
): Promise<UserInterface[]> {
    try {
        return await UserModel.find(query).sort({ deletedAt: 'desc' }).lean()
    } catch (e) {
        return Promise.reject(e)
    }
}

/** Get single record by id */
async function getUser({ id }: { id: string }): Promise<UserInterface> {
    try {
        const existingUser = await UserModel.findOne(
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

        if (!existingUser) throw NotFound({ caseId: 'User does not exist.' })

        return existingUser
    } catch (e) {
        return Promise.reject(e)
    }
}

/** Create one record */
async function createUser({
    fields,
}: {
    fields: Record<string, any>
}): Promise<UserInterface> {
    try {
        fields.password = await bcrypt.hash(fields.password, 10) // eslint-disable-line no-param-reassign
        const newUser = new UserModel(fields)

        const savedUser = await newUser.save()
        logger.info(`User saved: ${savedUser._id}`, logUsers)

        const {
            __v,
            createdAt,
            updatedAt,
            deletedAt,
            password,
            ...data
        } = savedUser.toObject()

        return data as UserInterface
    } catch (e) {
        logger.error(`User create failed`, logUsers)
        return Promise.reject(e)
    }
}

/** Delete one record */
async function deleteUser({ id }: { id: string }): Promise<UserInterface> {
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
            __v,
            // createdAt,
            updatedAt,
            deletedAt,
            password,
            ...data
        } = existingUser.toObject()

        return data as UserInterface
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
    id: string
    fields: Record<string, any>
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

        await existing.save()
        logger.info(`User updated: ${existing._id}`, logUsers)

        const {
            __v,
            createdAt,
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

/** Service */
function userService() {
    return {
        getAllUsers,
        getUser,
        createUser,
        deleteUser,
        updateUser,
        getAllUsersIncludeDeleted,
    }
}

export default userService
