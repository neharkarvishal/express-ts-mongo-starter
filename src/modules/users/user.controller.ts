/* eslint-disable consistent-return,@typescript-eslint/no-misused-promises */
import express, { RequestHandler } from 'express'
import mongoose from 'mongoose'

import { NotFound } from '../../exceptions/ApiException'
import authMiddleware from '../../middlewares/auth.middleware'
import validObjectId from '../../middlewares/objectId.validator.middleware'
import validator from '../../middlewares/validator.middleware'
import userService from './user.service'
import {
    createUserSchema,
    updateUserSchema,
    loginUserSchema,
} from './user.validator'

const logUsers = { tags: ['BACKEND', 'USER-CONTROLLER'] }

const {
    getUser,
    getAllUsers,
    createUser,
    deleteUser,
    updateUser,
    getAllUsersIncludeDeleted,
    loginUser,
    verifyEmail,
    verifyOtp,
} = userService()

const router = express.Router()

/** RequestHandler */
function getAllUsersHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { query = {} } = req
            const data = await getAllUsers(query)

            res.done({ data })
        } catch (e) {
            return next(e)
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
        } catch (e) {
            return next(e)
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
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function getMeHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const id = req.user._id

            if (!id) throw NotFound()

            const data = await getUser({ id })

            res.done({ code: 200, data })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function createUserHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const data = await createUser({ fields: req.body })

            res.done({ data, code: 201 })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function loginUserHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const data = await loginUser({ fields: req.body })

            res.done({ data, code: 201 })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function deleteUserHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const id = req.user._id

            if (!id) throw NotFound()

            const data = await deleteUser({ id })

            res.done({ data, code: 204 })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function updateUserHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const id = req.user._id

            if (!id) throw NotFound()

            const data = await updateUser({ id, fields: req.body })

            res.done({ data })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function verifyEmailUserHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { token } = req.params

            if (!token) throw NotFound()

            const data = await verifyEmail({ token })

            res.done({ data })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function verifyOtpUserHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { otp, phone } = req.params

            if (!otp) throw NotFound()

            const data = await verifyOtp({ otp, phone })

            res.done({ data })
        } catch (e) {
            return next(e)
        }
    }
}

/** User Controller */
function userController(options: { db: typeof mongoose }) {
    /** GET */
    router.get('/', authMiddleware(), getAllUsersHandler(options))

    /** GET */
    router.get('/me', authMiddleware(), getMeHandler(options))

    /** GET */
    router.get('/raw', authMiddleware(), getAllUsersIncludeDeletedHandler(options))

    /** GET */
    router.get('/:id', validObjectId(), getUserHandler(options))

    /** POST */
    router.post('/', validator(createUserSchema), createUserHandler(options))

    /** POST */
    router.post('/login', validator(loginUserSchema), loginUserHandler(options))

    /** DELETE */
    router.delete('/', authMiddleware(), deleteUserHandler(options))

    /** PUT */
    router.put(
        '/',
        authMiddleware(),
        validator(updateUserSchema),
        updateUserHandler(options),
    )

    /** PUT */
    router.put('/verify/email/:token', verifyEmailUserHandler(options))

    /** PUT */
    router.put('/verify/otp/:otp', verifyOtpUserHandler(options))

    return router
}

export default userController
