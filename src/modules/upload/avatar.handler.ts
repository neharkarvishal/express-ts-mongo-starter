import multer from 'multer'
import path from 'path'

import { uploadDir } from '../../config/env'
import { BadRequest } from '../../exceptions/ApiException'

export const AVATAR_FIELD_NAME = 'avatar' as const

export const avatarMulterHandler = multer({
    /** Upload rules */
    limits: {
        files: 1, // allow only 1 file per request
        fileSize: 1024 * 1024 * 2, // in bytes
    },

    /** File extension filter */
    fileFilter(req, file, cb) {
        const ext = path.extname(file.originalname)

        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg')
            return cb(BadRequest())

        cb(null, true)
    },

    /** Storage engine stuff */
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, uploadDir)
        },

        filename(req, file, cb) {
            const ext = path.extname(file.originalname)

            const uniqueSuffix = `${Date.now()}-${Math.round(
                Math.random() * 1e9,
            )}${ext}`

            cb(null, `${AVATAR_FIELD_NAME}-${uniqueSuffix}`) // eslint-disable-line @typescript-eslint/restrict-template-expressions
        },
    }),
})
