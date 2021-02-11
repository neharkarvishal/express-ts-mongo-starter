import { RequestHandler } from 'express'
import mongoose from 'mongoose'

import { NotFound } from '../exceptions/ApiException'

const { ObjectId } = mongoose.Types

const validObjectId = (key = 'id', error = NotFound): RequestHandler => {
    return (req, res, next) => {
        if (!ObjectId.isValid(req.params[key])) {
            next(error())
            return
        }

        next()
    }
}

export default validObjectId
