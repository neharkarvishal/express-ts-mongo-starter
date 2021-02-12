import { NotFound } from '../../exceptions/ApiException'
import { logger } from '../../utils/logger'
import { CaseInterface } from './case.interface'
import CaseModel, { CaseDocument } from './case.model'

const logCases = { tags: ['BACKEND', 'CASE-SERVICE'] }
const projection = { __v: 0, createdAt: 0, updatedAt: 0, deletedAt: 0 }

/** Get all of the records */
async function getAllCases(query: Record<string, any>): Promise<CaseInterface[]> {
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
async function getAllCasesIncludeDeleted(
    query: Record<string, any>,
): Promise<CaseInterface[]> {
    try {
        return await CaseModel.find(query).sort({ deletedAt: 'desc' }).lean()
    } catch (error) {
        return Promise.reject(error)
    }
}

/** Get single record by id */
async function getCase({ id }: { id: string }): Promise<CaseInterface> {
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
        ).exec()

        if (!existingCase)
            return Promise.reject(
                NotFound({
                    caseId: 'Case does not exist.',
                }),
            )

        return existingCase
    } catch (error) {
        return Promise.reject(error)
    }
}

/** Create one record */
async function createCase({
    fields,
}: {
    fields: Record<string, any>
}): Promise<CaseInterface> {
    try {
        const newCase = new CaseModel(fields)
        const savedCase = await newCase.save()
        logger.info(`Case saved: ${savedCase._id}`, logCases)

        const {
            __v,
            createdAt,
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
async function deleteCase({ id }: { id: string }): Promise<CaseInterface> {
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
            return Promise.reject(
                NotFound({
                    caseId: 'Case does not exist.',
                }),
            )

        existingCase.deletedAt = new Date()
        existingCase.markModified('deletedAt')
        await existingCase.save()

        logger.info(`Case deleted: ${existingCase._id}`, logCases)

        const { __v, createdAt, updatedAt, ...data } = existingCase.toObject()

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
        const { name } = fields

        const existingCase = await CaseModel.findOne({
            _id: id,
        }).exec()

        if (!existingCase)
            return Promise.reject(
                NotFound({
                    caseId: 'Case does not exist.',
                }),
            )

        existingCase.name = name
        await existingCase.save()
        logger.info(`Case updated: ${existingCase._id}`, logCases)

        const {
            __v,
            createdAt,
            updatedAt,
            deletedAt,
            ...data
        } = existingCase.toObject()

        return data
    } catch (error) {
        return Promise.reject(error)
    }
}

/** Service */
function caseService() {
    return {
        getAllCases,
        getCase,
        createCase,
        deleteCase,
        updateCase,
        getAllCasesIncludeDeleted,
    }
}

export default caseService
