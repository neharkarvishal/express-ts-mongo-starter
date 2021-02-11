import { Tag } from 'swagger-jsdoc'

import { Conflict, NotFound } from '../../exceptions/ApiException'
import { logger } from '../../utils/logger'
import TagModel, { ITag } from './tag.model'

const logTags = { tags: ['BACKEND', 'TAG-SERVICE'] }
const projection = { __v: 0, createdAt: 0, updatedAt: 0 }

const tagsService = () => {
    return {
        async getAllTags() {
            try {
                return await TagModel.find({}, projection).lean()
            } catch (error) {
                return Promise.reject(error)
            }
        },

        async getTag({ id }) {
            try {
                const existingTag = await TagModel.findOne(
                    {
                        _id: id,
                    },
                    projection,
                ).exec()

                if (!existingTag)
                    return Promise.reject(
                        NotFound({
                            tagId: 'Tag does not exist.',
                        }),
                    )

                return existingTag
            } catch (error) {
                return Promise.reject(error)
            }
        },

        async saveTag({ fields }) {
            try {
                const tag = new TagModel(fields)
                const savedTag = await tag.save()
                logger.info(`Tag saved: ${savedTag._id}`, logTags)

                const { __v, createdAt, updatedAt, ...data } = savedTag.toObject()

                return data as ITag
            } catch (error) {
                return Promise.reject(error)
            }
        },

        async deleteTag({ id }) {
            try {
                const existingTag = await TagModel.findOne({
                    _id: id,
                }).exec()

                if (!existingTag)
                    return Promise.reject(
                        NotFound({
                            tagId: 'Tag does not exist.',
                        }),
                    )

                existingTag.deletedAt = new Date()
                existingTag.markModified('deletedAt')
                await existingTag.save()

                logger.info(`Tag deleted: ${existingTag._id}`, logTags)

                const {
                    __v,
                    createdAt,
                    updatedAt,
                    ...data
                } = existingTag.toObject()

                return data as ITag
            } catch (error) {
                return Promise.reject(error)
            }
        },

        async updateTag({ id, fields }) {
            try {
                const { name } = fields

                const existingTag = await TagModel.findOne({
                    _id: id,
                }).exec()

                if (!existingTag)
                    return Promise.reject(
                        NotFound({
                            tagId: 'Tag does not exist.',
                        }),
                    )

                existingTag.name = name
                await existingTag.save()
                logger.info(`Tag updated: ${existingTag._id}`, logTags)

                const {
                    __v,
                    createdAt,
                    updatedAt,
                    ...data
                } = existingTag.toObject()

                return data
            } catch (error) {
                return Promise.reject(error)
            }
        },
    }
}

export default tagsService
