/* eslint-disable consistent-return,@typescript-eslint/no-misused-promises */
import express, { RequestHandler } from 'express'
import mongoose from 'mongoose'

import validObjectId from '../../middlewares/objectId.validator.middleware'
import validator from '../../middlewares/validator.middleware'
import caseHistoryService from './caseHistory.service'
import { createCaseSchema, updateCaseSchema } from './caseHistory.validator'

const logCases = { tags: ['BACKEND', 'CASE-HISTORY-CONTROLLER'] }

const { getCaseHistory, createCaseHistory } = caseHistoryService()

const router = express.Router()

/** RequestHandler */
function getCaseHistoryHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await getCaseHistory({ caseId: id })

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
            const { id } = req.params
            const fields = req.body
            fields.case = id

            const data = await createCaseHistory({ fields })

            res.done({ data, code: 201 })
        } catch (error) {
            next(error)
        }
    }
}

/** Case Controller */
function caseHistoryController(options: { db: typeof mongoose }) {
    /** GET */
    router.get('/:id/history', validObjectId(), getCaseHistoryHandler(options))

    /** POST */
    router.post(
        '/:id/history',
        validObjectId(),
        validator(createCaseSchema),
        createCaseHistoryHandler(options),
    )

    return router
}

export default caseHistoryController
