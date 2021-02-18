import { NotFound } from '../../exceptions/ApiException'
import MediaModel from '../../shared/models/Media'
import { logger } from '../../utils/logger'
import UserModel from '../users/user.model'
import NgoModel from './ngo.model'

const logNGOs = { tags: ['BACKEND', 'NGO-SERVICE'] }
const projection = {
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
    deletedAt: 0,
    password: 0,
}

/** Get all of the records */
async function getAllNGOs(query: Record<string, any>) {
    try {
        return await NgoModel.find(
            {
                $and: [
                    query,
                    {
                        deletedAt: null,
                    },
                ],
            },
            projection,
        ).lean()
    } catch (error) {
        return Promise.reject(error)
    }
}

/** Get all of the records, including soft-deleted */
async function getAllNGOsIncludeDeleted(query: Record<string, any>) {
    try {
        return await NgoModel.find(query).sort({ deletedAt: 'desc' }).lean()
    } catch (error) {
        return Promise.reject(error)
    }
}

/** Get single record by id */
async function getNGO({ id }: { id: string }) {
    try {
        const existingNGO = await NgoModel.findOne(
            {
                $and: [
                    {
                        _id: id,
                    },
                    {
                        deletedAt: null,
                    },
                ],
            },
            projection,
        )
            .populate({ path: 'animalDetails.image', model: MediaModel })
            .populate({ path: 'addedBy', model: UserModel, select: projection })
            .exec()

        if (!existingNGO)
            return Promise.reject(NotFound({ caseId: 'NGO does not exist.' }))

        return existingNGO
    } catch (error) {
        return Promise.reject(error)
    }
}

/** Create one record */
async function createNGO({ fields }: { fields: Record<string, any> }) {
    try {
        const newNGO = new NgoModel(fields)
        const savedNGO = await newNGO.save()
        logger.info(`NGO saved: ${savedNGO._id}`, logNGOs)

        const {
            __v,
            createdAt,
            updatedAt,
            deletedAt,
            ...data
        } = savedNGO.toObject()

        return data
    } catch (error) {
        logger.error(`NGO create failed`, logNGOs)
        return Promise.reject(error)
    }
}

/** Delete one record */
async function deleteNGO({ id }: { id: string }) {
    try {
        const existingNGO = await NgoModel.findOne({
            $and: [
                {
                    _id: id,
                },
                {
                    deletedAt: null,
                },
            ],
        }).exec()

        if (!existingNGO)
            return Promise.reject(NotFound({ caseId: 'NGO does not exist.' }))

        existingNGO.deletedAt = new Date()
        existingNGO.markModified('deletedAt')
        await existingNGO.save()

        logger.info(`NGO deleted: ${existingNGO._id}`, logNGOs)

        const {
            __v,
            createdAt,
            updatedAt,
            deletedAt,
            ...data
        } = existingNGO.toObject()

        return data
    } catch (error) {
        logger.error(`NGO delete failed ${id}`, logNGOs)
        return Promise.reject(error)
    }
}

/** Update one record */
async function updateNGO({
    id,
    fields,
}: {
    id: string
    fields: Record<string, any>
}) {
    try {
        const existing = await NgoModel.findOne({
            _id: id,
        }).exec()

        if (!existing)
            return Promise.reject(NotFound({ caseId: 'NGO does not exist.' }))

        // updating point(location)
        if (fields?.point) {
            existing.point = fields.point
            existing.markModified('point')
        }

        // updating area
        if (fields?.area) {
            existing.area = fields.area
            existing.markModified('area')
        }

        await existing.save()
        logger.info(`NGO updated: ${existing._id}`, logNGOs)

        const {
            __v,
            createdAt,
            updatedAt,
            deletedAt,
            ...data
        } = existing.toObject()

        return data
    } catch (error) {
        return Promise.reject(error)
    }
}

/** Service */
function ngoService() {
    return {
        getAllNGOs,
        getNGO,
        createNGO,
        deleteNGO,
        updateNGO,
        getAllNGOsIncludeDeleted,
    }
}

export default ngoService
