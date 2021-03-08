/* eslint-disable consistent-return,@typescript-eslint/no-misused-promises */
import express, { RequestHandler } from 'express'
import mongoose from 'mongoose'

import authMiddleware from '../../middlewares/auth.middleware'
import validObjectId from '../../middlewares/objectId.validator.middleware'
import validator from '../../middlewares/validator.middleware'
import ngoService from './ngo.service'
import { createNGOSchema, updateNGOSchema } from './ngo.validator'

const logNGOs = { tags: ['BACKEND', 'NGO-CONTROLLER'] }

const {
    getNGO,
    getAllNGOs,
    createNGO,
    deleteNGO,
    updateNGO,
    getAllNGOsIncludeDeleted,
} = ngoService()

const router = express.Router()

/** RequestHandler */
function getAllNGOsHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { query = {} } = req
            const data = await getAllNGOs(query)

            res.done({ data })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function getAllNGOsIncludeDeletedHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { query = {} } = req
            const data = await getAllNGOsIncludeDeleted(query)

            res.done({ data })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function getNGOHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await getNGO({ id })

            res.done({ code: 200, data })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function createNGOHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const data = await createNGO({ fields: req.body })

            res.done({ data, code: 201 })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function deleteNGOHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await deleteNGO({ id })

            res.done({ data, code: 204 })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function updateNGOHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await updateNGO({ id, fields: req.body })

            res.done({ data })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function verifyNGOHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await updateNGO({ id, fields: { verifiedAt: new Date() } })

            res.done({ data })
        } catch (e) {
            return next(e)
        }
    }
}

/** NGO Controller */
function ngoController(options: { db: typeof mongoose }) {
    /** GET */
    router.get('/', getAllNGOsHandler(options))

    /** GET */
    router.get('/raw', getAllNGOsIncludeDeletedHandler(options))

    /** GET */
    router.get('/:id', validObjectId(), getNGOHandler(options))

    /** POST */
    router.post('/', validator(createNGOSchema), createNGOHandler(options))

    /** DELETE */
    router.delete('/:id', validObjectId(), deleteNGOHandler(options))

    /** PUT */
    router.put(
        '/:id',
        validObjectId(),
        validator(updateNGOSchema),
        updateNGOHandler(options),
    )

    /** PUT */
    router.put(
        '/:id/verify',
        validObjectId(),
        authMiddleware({ role: 'ADMIN' }),
        verifyNGOHandler(options),
    )

    return router
}

export default ngoController
