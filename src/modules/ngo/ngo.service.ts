/* eslint-disable prefer-const */
import { NotFound } from '../../exceptions/ApiException'
import { logger } from '../../utils/logger'
import MediaModel from '../upload/upload.model'
import UserModel from '../users/user.model'
import NgoModel from './ngo.model'

const EARTHS_RADIUS_IN_KM = 6371 as const

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
        let {
            // defaults to mumbai's coordinates
            longitude = 72.877,
            latitude = 19.076,

            /*
             get the max|min distance or set it to 8|0 KMs
             Note: KMs if we use legacy coordinates and divides it by earths radius, otherwise assume meters
            */
            maxDistance = 8,
            minDistance = Number.MIN_VALUE,
        } = query

        /*
         we need to convert the distance to radians, the radius of Earth is approx 6371 KM
         because mongoose's near() function takes point using legacy coordinates system of radians

         REFER: https://docs.mongodb.com/manual/reference/operator/query/nearSphere/index.html
        */
        maxDistance /= EARTHS_RADIUS_IN_KM
        minDistance /= EARTHS_RADIUS_IN_KM

        return await NgoModel.find({}, projection)
            .where('area')
            .near({
                center: [longitude, latitude],
                spherical: true,
                maxDistance,
                minDistance,
            })
            .limit(3)
    } catch (e) {
        return Promise.reject(e)
    }
}

/** Get all of the records, including soft-deleted */
async function getAllNGOsIncludeDeleted(query: Record<string, any>) {
    try {
        return await NgoModel.find(query).sort({ deletedAt: 'desc' }).lean()
    } catch (e) {
        return Promise.reject(e)
    }
}

/** Get single record by id */
async function getNGO({ id }: { readonly id: string }) {
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

        if (!existingNGO) throw NotFound({ caseId: 'NGO does not exist.' })

        return existingNGO
    } catch (e) {
        return Promise.reject(e)
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
    } catch (e) {
        logger.error(`NGO create failed`, logNGOs)
        return Promise.reject(e)
    }
}

/** Delete one record */
async function deleteNGO({ id }: { readonly id: string }) {
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

        if (!existingNGO) throw NotFound({ caseId: 'NGO does not exist.' })

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
    } catch (e) {
        logger.error(`NGO delete failed ${id}`, logNGOs)
        return Promise.reject(e)
    }
}

/** Update one record */
async function updateNGO({
    id,
    fields,
}: {
    readonly id: string
    fields: Record<string, any>
}) {
    try {
        const existing = await NgoModel.findOne({
            _id: id,
        }).exec()

        if (!existing) throw NotFound({ caseId: 'NGO does not exist.' })

        if (fields?.area) {
            existing.area = fields.area
            existing.markModified('area')
        }

        if (fields?.description) {
            existing.description = fields.description
            existing.markModified('description')
        }

        if (fields?.address) {
            existing.address = fields.address
            existing.markModified('address')
        }

        if (fields?.verifiedAt) {
            existing.verifiedAt = fields.verifiedAt
            existing.markModified('verifiedAt')
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
    } catch (e) {
        return Promise.reject(e)
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
