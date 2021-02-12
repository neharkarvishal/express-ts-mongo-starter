/* eslint-disable consistent-return,@typescript-eslint/no-misused-promises */
import express, { RequestHandler } from 'express'
import mongoose from 'mongoose'

import validObjectId from '../../middlewares/objectId.validator.middleware'
import validator from '../../middlewares/validator.middleware'
import caseService from './case.service'
import { caseSchema } from './case.validator'

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
function getAllCasesHandler(): RequestHandler {
    return async (req, res, next) => {
        try {
            const data = await getAllCases({})

            res.done({ data })
        } catch (error) {
            next(error)
        }
    }
}

/** RequestHandler */
function getAllCasesIncludeDeletedHandler(): RequestHandler {
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
function getCaseHandler(): RequestHandler {
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
function createCaseHandler(): RequestHandler {
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
function deleteCaseHandler(): RequestHandler {
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
function updateCaseHandler(): RequestHandler {
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
    router.get('/', getAllCasesHandler())
    router.get('/raw', getAllCasesIncludeDeletedHandler())
    router.get('/:id', validObjectId(), getCaseHandler())
    router.post('/', validator(caseSchema), createCaseHandler())
    router.delete('/:id', validObjectId(), deleteCaseHandler())
    router.put('/:id', validObjectId(), validator(caseSchema), updateCaseHandler())

    return router
}

export default caseController
