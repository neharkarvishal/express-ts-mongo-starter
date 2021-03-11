/* eslint-disable consistent-return,@typescript-eslint/no-misused-promises */
import express, { RequestHandler } from 'express'
import fs from 'fs'
import mongoose from 'mongoose'

import authMiddleware from '../../middlewares/auth.middleware'
import validObjectId from '../../middlewares/objectId.validator.middleware'
import validator from '../../middlewares/validator.middleware'
import { UserCollectionName } from '../users/user.model'
import { AVATAR_FIELD_NAME, avatarMulterHandler } from './avatar.handler'
import uploadService from './upload.service'
import { uploadSchema } from './upload.validator'

const { getUpload, avatarUpload, updateUpload } = uploadService()

const logUpload = { tags: ['BACKEND', 'UPLOAD-CONTROLLER'] }

const router = express.Router()

/** RequestHandler */
function getUploadHandler(options): RequestHandler {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const data = await getUpload({ id: req.params.id ?? '' })

            res.done({ code: 200, data })
        } catch (e) {
            return next(e)
        }
    }
}

/** RequestHandler */
function avatarUploadHandler(options): RequestHandler {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any

    return async (req, res, next) => {
        try {
            const data = await avatarUpload({
                body: req?.body,
                file: req?.file,
                user: req?.user,
            })

            res.done({
                data: {
                    file: req.file,
                    meta: data,
                },
                code: 201,
            })
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
    router.post(
        '/avatar',
        authMiddleware(),
        avatarMulterHandler.single(AVATAR_FIELD_NAME),
        avatarUploadHandler(options),
    )

    /** PUT */
    router.put('/:id', validObjectId(), updateUploadHandler(options))

    return router
}

export default uploadController
