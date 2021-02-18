/* eslint-disable consistent-return,@typescript-eslint/no-misused-promises */
import express, { RequestHandler } from 'express'
import mongoose from 'mongoose'

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
        } catch (error) {
            next(error)
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
        } catch (error) {
            next(error)
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
        } catch (error) {
            next(error)
        }
    }
}

/** RequestHandler */
function createNGOHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const data = await createNGO({ fields: req.body })

            res.done({ data, code: 201 })
        } catch (error) {
            next(error)
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
        } catch (error) {
            next(error)
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
        } catch (error) {
            next(error)
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

    return router
}

export default ngoController
