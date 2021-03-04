/* eslint-disable consistent-return,@typescript-eslint/no-misused-promises */
import express, { RequestHandler } from 'express'
import fs from 'fs'
import mongoose from 'mongoose'
import multer from 'multer'

import validObjectId from '../../middlewares/objectId.validator.middleware'
import validator from '../../middlewares/validator.middleware'
import uploadService from './upload.service'

// logs dir
const logDir = `${__dirname}/../../uploads`

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}

const upload = multer({ dest: logDir })

const { getUpload, createUpload, updateUpload } = uploadService()

const logUpload = { tags: ['BACKEND', 'UPLOAD-CONTROLLER'] }

const router = express.Router()

/** RequestHandler */
function getUploadHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params

            res.done({ code: 200, data: [] })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function createUploadHandler(options): RequestHandler {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any

    return async (req, res, next) => {
        try {
            const data = getUpload({ id: req.params.id ?? '' })
            res.done({ data, code: 201 })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function updateUploadHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params

            res.done({ data: [], code: 201 })
        } catch (e) {
            return next(e)
        }
    }
}

/** Case Controller */
function uploadController(options: { db: typeof mongoose }) {
    /** GET */
    router.get('/:id', validObjectId(), getUploadHandler(options))

    /** POST */
    router.post('/', upload.single('avatar'), createUploadHandler(options))

    /** PUT */
    router.put('/:id', validObjectId(), updateUploadHandler(options))

    return router
}

export default uploadController
