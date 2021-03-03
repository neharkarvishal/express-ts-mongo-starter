import { RequestHandler } from 'express'
import mongoose from 'mongoose'

import { NotFound } from '../exceptions/ApiException'

const { ObjectId } = mongoose.Types

const validObjectId = (key = 'id', error = NotFound): RequestHandler => {
    return async (req, res, next) => {
        try {
            if (!ObjectId.isValid(req.params[key])) throw error()

            return next()
        } catch (e) {
            return next(e)
        }
    }
}

export default validObjectId
