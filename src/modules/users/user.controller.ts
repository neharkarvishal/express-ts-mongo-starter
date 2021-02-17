/* eslint-disable consistent-return,@typescript-eslint/no-misused-promises */
import express, { RequestHandler } from 'express'
import mongoose from 'mongoose'

import validObjectId from '../../middlewares/objectId.validator.middleware'
import validator from '../../middlewares/validator.middleware'
import userService from './user.service'
import { createUserSchema, updateUserSchema } from './user.validator'

const logUsers = { tags: ['BACKEND', 'USER-CONTROLLER'] }

const {
    getUser,
    getAllUsers,
    createUser,
    deleteUser,
    updateUser,
    getAllUsersIncludeDeleted,
} = userService()

const router = express.Router()

/** RequestHandler */
function getAllUsersHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { query = {} } = req
            const data = await getAllUsers(query)

            res.done({ data })
        } catch (error) {
            next(error)
        }
    }
}

/** RequestHandler */
function getAllUsersIncludeDeletedHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { query = {} } = req
            const data = await getAllUsersIncludeDeleted(query)

            res.done({ data })
        } catch (error) {
            next(error)
        }
    }
}

/** RequestHandler */
function getUserHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await getUser({ id })

            res.done({ code: 200, data })
        } catch (error) {
            next(error)
        }
    }
}

/** RequestHandler */
function createUserHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const data = await createUser({ fields: req.body })

            res.done({ data, code: 201 })
        } catch (error) {
            next(error)
        }
    }
}

/** RequestHandler */
function deleteUserHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await deleteUser({ id })

            res.done({ data, code: 204 })
        } catch (error) {
            next(error)
        }
    }
}

/** RequestHandler */
function updateUserHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await updateUser({ id, fields: req.body })

            res.done({ data })
        } catch (error) {
            next(error)
        }
    }
}

/** User Controller */
function userController(options: { db: typeof mongoose }) {
    /** GET */
    router.get('/', getAllUsersHandler(options))

    /** GET */
    router.get('/raw', getAllUsersIncludeDeletedHandler(options))

    /** GET */
    router.get('/:id', validObjectId(), getUserHandler(options))

    /** POST */
    router.post('/', validator(createUserSchema), createUserHandler(options))

    /** DELETE */
    router.delete('/:id', validObjectId(), deleteUserHandler(options))

    /** PUT */
    router.put(
        '/:id',
        validObjectId(),
        validator(updateUserSchema),
        updateUserHandler(options),
    )

    return router
}

export default userController
