/* eslint-disable consistent-return,@typescript-eslint/no-misused-promises */
import express, { RequestHandler } from 'express'
import mongoose from 'mongoose'

import validObjectId from '../../middlewares/objectId.validator.middleware'
import validator from '../../middlewares/validator.middleware'
import caseService from './case.service'
import { createCaseSchema, updateCaseSchema } from './case.validator'

const logCases = { tags: ['BACKEND', 'CASE-CONTROLLER'] }

const {
    getCase,
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
            const { query } = req

            console.log({ query })

            const data = await getAllCases(query)

            res.done({ data })
        } catch (error) {
            next(error)
        }
    }
}

/** RequestHandler */
function getAllCasesIncludeDeletedHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const data = await getAllCasesIncludeDeleted({})

            res.done({ data })
        } catch (error) {
            next(error)
        }
    }
}

/** RequestHandler */
function getCaseHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await getCase({ id })

            res.done({ code: 200, data })
        } catch (error) {
            next(error)
        }
    }
}

/** RequestHandler */
function createCaseHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const data = await createCase({ fields: req.body })

            res.done({ data, code: 201 })
        } catch (error) {
            next(error)
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
        } catch (error) {
            next(error)
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
        } catch (error) {
            next(error)
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
    router.get('/:id', validObjectId(), getCaseHandler(options))

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

    return router
}

export default caseController
