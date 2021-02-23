/* eslint-disable consistent-return,@typescript-eslint/no-misused-promises */
import express, { RequestHandler } from 'express'
import mongoose from 'mongoose'

import validObjectId from '../../middlewares/objectId.validator.middleware'
import validator from '../../middlewares/validator.middleware'
import caseHistoryService from './caseHistory.service'
import {
    createCaseHistorySchema,
    updateCaseHistorySchema,
} from './caseHistory.validator'

const logCases = { tags: ['BACKEND', 'CASE-HISTORY-CONTROLLER'] }

const {
    getCaseHistory,
    createCaseHistory,
    updateCaseHistory,
} = caseHistoryService()

const router = express.Router()

/** RequestHandler */
function getCaseHistoryHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await getCaseHistory({ id })

            res.done({ code: 200, data })
        } catch (error) {
            next(error)
        }
    }
}

/** RequestHandler */
function createCaseHistoryHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const data = await createCaseHistory({ fields: req.body })

            res.done({ data, code: 201 })
        } catch (error) {
            next(error)
        }
    }
}

/** RequestHandler */
function updateCaseHistoryHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await updateCaseHistory({ id, fields: req.body })

            res.done({ data, code: 201 })
        } catch (error) {
            next(error)
        }
    }
}

/** Case Controller */
function caseHistoryController(options: { db: typeof mongoose }) {
    /** GET */
    router.get('/:id', validObjectId(), getCaseHistoryHandler(options))

    /** POST */
    router.post(
        '/',
        validator(createCaseHistorySchema),
        createCaseHistoryHandler(options),
    )

    /** PUT */
    router.put(
        '/:id',
        validObjectId(),
        validator(updateCaseHistorySchema),
        updateCaseHistoryHandler(options),
    )

    return router
}

export default caseHistoryController
