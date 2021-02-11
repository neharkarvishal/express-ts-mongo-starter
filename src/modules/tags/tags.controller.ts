/* eslint-disable consistent-return,@typescript-eslint/no-misused-promises */
import express from 'express'
import Joi from 'joi'
import mongoose from 'mongoose'

import validObjectId from '../../middlewares/objectId.validator.middleware'
import validator from '../../middlewares/validator.middleware'
import { logger } from '../../utils/logger'
import tags from './tags.service'

const { getTag, getAllTags, saveTag, deleteTag, updateTag } = tags()

const router = express.Router()

/** Tag validation Schema */
const tagsSchema = Joi.object({
    name: Joi.string().min(2).max(60).required().label('Tag Name'),
}).label('Tags validation schema')

/** Get all tags */
function getAllTagsHandler() {
    return async (req, res, next) => {
        try {
            const tagList = await getAllTags()

            res.done({ data: tagList })
        } catch (error) {
            next(error)
        }
    }
}

function getTagHandler() {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const tag = await getTag({ id })

            res.done({ code: 200, data: tag })
        } catch (error) {
            next(error)
        }
    }
}

function saveTagHandler() {
    return async (req, res, next) => {
        try {
            const tag = await saveTag({ fields: req.body })

            res.done({ data: tag, code: 201 })
        } catch (error) {
            next(error)
        }
    }
}

function deleteTagHandler() {
    return async (req, res, next) => {
        try {
            const { id } = req.params

            await deleteTag({ id })

            res.done({ data: id })
        } catch (error) {
            next(error)
        }
    }
}

function updateTagHandler() {
    return async (req, res, next) => {
        try {
            const { id } = req.params
            const updatedTag = await updateTag({ id, fields: req.body })

            res.done({ message: 'Tag updated.', data: updatedTag })
        } catch (error) {
            next(error)
        }
    }
}

const tagsController = (options: { db: typeof mongoose }) => {
    router.get('/', getAllTagsHandler())
    router.get('/:id', validObjectId(), getTagHandler())
    router.post('/', validator(tagsSchema), saveTagHandler())
    router.delete('/:id', validObjectId(), deleteTagHandler())
    router.put('/:id', validObjectId(), validator(tagsSchema), updateTagHandler())

    return router
}

export default tagsController
