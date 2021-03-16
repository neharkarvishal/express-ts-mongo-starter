import { NotFound } from '../../exceptions/ApiException'
import { logger } from '../../utils/logger'
import CaseModel from '../case/case.model'
import UserModel from '../users/user.model'
import CaseHistoryModel from './caseHistory.model'

const logCases = { tags: ['BACKEND', 'CASE-HISTORY-SERVICE'] }
const projection = {
    __v: 0,
    // createdAt: 0,
    updatedAt: 0,
    deletedAt: 0,
    password: 0,
}

/** Get single record by id */
async function getCaseHistory({ id }: { id: string }) {
    try {
        const existingCase = await CaseHistoryModel.find(
            {
                _id: id,
            },
            projection,
        )
            .populate({ path: 'case', model: CaseModel, select: projection })
            .populate({ path: 'assignedTo', model: UserModel, select: projection })
            .exec()

        if (!existingCase) throw NotFound({ caseId: 'History does not exist.' })

        return existingCase
    } catch (e) {
        return Promise.reject(e)
    }
}

/** Create one record */
async function createCaseHistory({ fields }: { fields: Record<string, any> }) {
    try {
        const [existingCase, assignedToUser] = await Promise.all([
            CaseModel.findOne({
                $and: [
                    {
                        _id: fields.case,
                    },
                ],
            }).exec(),
            UserModel.findOne({
                $and: [
                    {
                        _id: fields.assignedTo,
                    },
                ],
            }),
        ])

        if (!existingCase) throw NotFound({ caseId: 'Case does not exist.' })
        if (!assignedToUser) throw NotFound({ userId: 'User does not exist.' })

        const newCaseHistory = new CaseHistoryModel(fields)
        const savedCase = await newCaseHistory.save()

        // update history array of the case
        existingCase.history.push(`${savedCase._id}`)
        existingCase.markModified('history')
        await existingCase.save()

        logger.info(`Case saved: ${savedCase._id}`, logCases)

        const {
            __v, // @ts-ignore
            createdAt,
            // updatedAt,
            // deletedAt,
            ...data
        } = savedCase.toObject()

        return data
    } catch (e) {
        logger.error(`Case create failed`, logCases)
        return Promise.reject(e)
    }
}

/** Create one record */
async function updateCaseHistory({
    id,
    fields,
}: {
    id: string
    fields: Record<string, any>
}) {
    try {
        const caseHistory = await CaseHistoryModel.findOne({ _id: id }).exec()

        if (!caseHistory) throw NotFound({ caseId: 'User does not exist.' })

        if (fields?.case) {
            const existingCase = await CaseModel.findOne({
                $and: [
                    {
                        _id: fields.case,
                    },
                ],
            }).exec()

            if (!existingCase) throw NotFound({ caseId: 'Case does not exist.' })

            caseHistory.case = fields.case
            caseHistory.markModified('case')
        }

        if (fields?.assignedTo) {
            const assignedToUser = await UserModel.findOne({
                $and: [
                    {
                        _id: fields.assignedTo,
                    },
                ],
            })

            if (!assignedToUser) throw NotFound({ caseId: 'User does not exist.' })

            caseHistory.assignedTo = fields.assignedTo
            caseHistory.markModified('assignedTo')
        }

        if (fields?.description) {
            caseHistory.description = fields.description
            caseHistory.markModified('description')
        }

        const savedCase = await caseHistory.save()
        logger.info(`Case updated: ${savedCase._id}`, logCases)

        const {
            __v, // @ts-ignore
            createdAt,
            // updatedAt,
            // deletedAt,
            ...data
        } = savedCase.toObject()

        return data
    } catch (e) {
        logger.error(`Case update failed`, logCases)
        return Promise.reject(e)
    }
}

/** Service */
function caseHistoryService() {
    return {
        getCaseHistory,
        createCaseHistory,
        updateCaseHistory,
    }
}

export default caseHistoryService
