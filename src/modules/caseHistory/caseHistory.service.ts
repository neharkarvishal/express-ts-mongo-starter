import { NotFound } from '../../exceptions/ApiException'
import MediaModel from '../../shared/models/Media'
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

        if (!existingCase)
            return Promise.reject(NotFound({ caseId: 'History does not exist.' }))

        return existingCase
    } catch (error) {
        return Promise.reject(error)
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

        if (!existingCase)
            return Promise.reject(NotFound({ caseId: 'Case does not exist.' }))
        if (!assignedToUser)
            return Promise.reject(NotFound({ caseId: 'User does not exist.' }))

        const newCaseHistory = new CaseHistoryModel(fields)
        const savedCase = await newCaseHistory.save()

        existingCase.history.push(`${savedCase._id}`)
        existingCase.markModified('history')
        await existingCase.save()

        logger.info(`Case saved: ${savedCase._id}`, logCases)

        const {
            __v,
            createdAt,
            // updatedAt,
            // deletedAt,
            ...data
        } = savedCase.toObject()

        return data
    } catch (error) {
        logger.error(`Case create failed`, logCases)
        return Promise.reject(error)
    }
}

/** Service */
function caseHistoryService() {
    return {
        getCaseHistory,
        createCaseHistory,
    }
}

export default caseHistoryService
