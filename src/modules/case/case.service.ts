import { NotFound } from '../../exceptions/ApiException'
import MediaModel from '../../shared/models/Media'
import { logger } from '../../utils/logger'
import CaseHistoryModel from '../caseHistory/caseHistory.model'
import NgoModel from '../ngo/ngo.model'
import ngoService from '../ngo/ngo.service'
import UserModel from '../users/user.model'
import { CaseInterface } from './case.interface'
import CaseModel from './case.model'

const logCases = { tags: ['BACKEND', 'CASE-SERVICE'] }
const projection = {
    __v: 0,
    createdAt: 0,
    updatedAt: 0,
    deletedAt: 0,
    password: 0,
}

const { getAllNGOs } = ngoService()

/** Get all of the records */
async function getAllCases(query: Record<string, any>) {
    try {
        return await CaseModel.find(
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
async function getAllCasesIncludeDeleted(query: Record<string, any>) {
    try {
        return await CaseModel.find(query).sort({ deletedAt: 'desc' }).lean()
    } catch (error) {
        return Promise.reject(error)
    }
}

/** Get single record by id */
async function getCaseById({ id }: { id: string }) {
    try {
        const existingCase = await CaseModel.findOne(
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
            .populate({ path: 'addedBy', model: UserModel, select: projection })
            .populate({ path: 'assignedNgo', model: NgoModel, select: projection })
            .populate({
                path: 'history',
                model: CaseHistoryModel,
                select: projection,
            })
            .populate({
                path: 'animalDetails.image',
                model: MediaModel,
                select: projection,
            })
            .exec()

        if (!existingCase)
            return Promise.reject(NotFound({ caseId: 'Case does not exist.' }))

        return existingCase
    } catch (error) {
        return Promise.reject(error)
    }
}

/** Create one record */
async function createCase({ fields }: { fields: Record<string, any> }) {
    try {
        const nearByNgos = await getAllNGOs({
            maxDistance: 99999999999999999999999999999999999, // kilometers, near by NOGs in this radius
            longitude: fields.point.coordinates[0] ?? 72.877, // defaults to mumbai's coordinates
            latitude: fields.point.coordinates[1] ?? 19.076,
        })

        if (!nearByNgos.length)
            return Promise.reject(NotFound({ message: 'No NGO found' }))

        const newCase = new CaseModel(fields)
        newCase.assignedNgo = nearByNgos[0].id

        const savedCase = await newCase.save()

        await savedCase
            .populate({ path: 'animalDetails.image', model: MediaModel })
            .populate({ path: 'addedBy', model: UserModel, select: projection })
            .populate({ path: 'assignedNgo', model: NgoModel, select: projection })
            .execPopulate()

        logger.info(`Case saved: ${savedCase._id}`, logCases)

        const {
            __v,
            // createdAt,
            updatedAt,
            deletedAt,
            ...data
        } = savedCase.toObject()

        return data as CaseInterface
    } catch (error) {
        logger.error(`Case create failed`, logCases)
        return Promise.reject(error)
    }
}

/** Delete one record */
async function deleteCase({ id }: { id: string }) {
    try {
        const existingCase = await CaseModel.findOne({
            $and: [
                {
                    _id: id,
                },
                {
                    deletedAt: null,
                },
            ],
        }).exec()

        if (!existingCase)
            return Promise.reject(NotFound({ caseId: 'Case does not exist.' }))

        existingCase.deletedAt = new Date()
        existingCase.markModified('deletedAt')
        await existingCase.save()

        logger.info(`Case deleted: ${existingCase._id}`, logCases)

        const {
            __v,
            // createdAt,
            updatedAt,
            deletedAt,
            ...data
        } = existingCase.toObject()

        return data as CaseInterface
    } catch (error) {
        logger.error(`Case delete failed ${id}`, logCases)
        return Promise.reject(error)
    }
}

/** Update one record */
async function updateCase({
    id,
    fields,
}: {
    id: string
    fields: Record<string, any>
}) {
    try {
        const existing = await CaseModel.findOne({
            _id: id,
        }).exec()

        if (!existing)
            return Promise.reject(NotFound({ caseId: 'Case does not exist.' }))

        // updating adminalDetails
        if (fields?.animalDetails) {
            if (fields.animalDetails?.type)
                existing.animalDetails.type = fields.animalDetails.type

            existing.markModified('animalDetails')
        }

        // updating status
        if (fields?.status) {
            existing.status = fields.status
            existing.markModified('status')
        }

        // updating point(location)
        if (fields?.point) {
            existing.point = fields.point
            existing.markModified('point')
        }

        await existing.save()
        logger.info(`Case updated: ${existing._id}`, logCases)

        const {
            __v,
            // createdAt,
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
function caseService() {
    return {
        getAllCases,
        getCaseById,
        createCase,
        deleteCase,
        updateCase,
        getAllCasesIncludeDeleted,
    }
}

export default caseService
