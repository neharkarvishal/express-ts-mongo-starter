import bcrypt from 'bcrypt'

import { NotFound } from '../../exceptions/ApiException'
import MediaModel from '../../shared/models/Media'
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
    } catch (error) {
        return Promise.reject(error)
    }
}

/** Get all of the records, including soft-deleted */
async function getAllUsersIncludeDeleted(
    query: Record<string, any>,
): Promise<UserInterface[]> {
    try {
        return await UserModel.find(query).sort({ deletedAt: 'desc' }).lean()
    } catch (error) {
        return Promise.reject(error)
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

        if (!existingUser)
            return Promise.reject(NotFound({ caseId: 'User does not exist.' }))

        return existingUser
    } catch (error) {
        return Promise.reject(error)
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
    } catch (error) {
        logger.error(`User create failed`, logUsers)
        return Promise.reject(error)
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

        if (!existingUser)
            return Promise.reject(NotFound({ caseId: 'User does not exist.' }))

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
    } catch (error) {
        logger.error(`User delete failed ${id}`, logUsers)
        return Promise.reject(error)
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

        if (!existing)
            return Promise.reject(NotFound({ caseId: 'User does not exist.' }))

        if (fields?.password) {
            existing.password = await bcrypt.hash(fields.password, 10)
            existing.markModified('password')
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
    } catch (error) {
        return Promise.reject(error)
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
