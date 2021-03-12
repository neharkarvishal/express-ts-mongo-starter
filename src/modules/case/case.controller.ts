/* eslint-disable consistent-return,@typescript-eslint/no-misused-promises */
import express, { RequestHandler } from 'express'
import mongoose from 'mongoose'

import validObjectId from '../../middlewares/objectId.validator.middleware'
import validator from '../../middlewares/validator.middleware'
import caseService from './case.service'
import {
    createCaseSchema,
    rescheduleCaseSchema,
    updateCaseSchema,
} from './case.validator'

const logCases = { tags: ['BACKEND', 'CASE-CONTROLLER'] }

const {
    getCaseById,
    getAllCases,
    createCase,
    deleteCase,
    updateCase,
    getAllCasesIncludeDeleted,
} = caseService()

const router = express.Router()

/** RequestHandler */
function getAllCasesHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { query = {} } = req
            const data = await getAllCases(query)

            res.done({ data })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function getAllCasesIncludeDeletedHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { query = {} } = req
            const data = await getAllCasesIncludeDeleted(query)

            res.done({ data })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function getCaseByIdHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await getCaseById({ id })

            res.done({ code: 200, data })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function createCaseHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const data = await createCase({ fields: req.body })

            res.done({ data, code: 201 })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function deleteCaseHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await deleteCase({ id })

            res.done({ data, code: 204 })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function updateCaseHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await updateCase({ id, fields: req.body })

            res.done({ data })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function rescheduleCaseHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await updateCase({ id, fields: req.body })

            res.done({ data })
        } catch (e) {
            return next(e)
        }
    }
}

/** Case Controller */
function caseController(options: { db: typeof mongoose }) {
    /** GET */
    router.get('/', getAllCasesHandler(options))

    /** GET */
    router.get('/raw', getAllCasesIncludeDeletedHandler(options))

    /** GET */
    router.get('/:id', validObjectId(), getCaseByIdHandler(options))

    /** POST */
    router.post('/', validator(createCaseSchema), createCaseHandler(options))

    /** DELETE */
    router.delete('/:id', validObjectId(), deleteCaseHandler(options))

    /** PUT */
    router.put(
        '/:id',
        validObjectId(),
        validator(updateCaseSchema),
        updateCaseHandler(options),
    )

    /** PUT */
    router.put(
        '/:id/reschedule',
        validObjectId(),
        validator(rescheduleCaseSchema),
        rescheduleCaseHandler(options),
    )

    return router
}

export default caseController
