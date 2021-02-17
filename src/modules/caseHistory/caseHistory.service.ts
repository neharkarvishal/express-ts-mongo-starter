import { NotFound } from '../../exceptions/ApiException'
import MediaModel from '../../shared/models/Media'
import { logger } from '../../utils/logger'
import CaseModel from '../case/case.model'
import UserModel from '../users/user.model'
import CaseHistoryModel from './caseHistory.model'

const logCases = { tags: ['BACKEND', 'CASE-SERVICE'] }
const projection = {
    __v: 0,
    // createdAt: 0,
    updatedAt: 0,
    deletedAt: 0,
    password: 0,
}

/** Get single record by id */
async function getCaseHistory({ caseId }: { caseId: string }): Promise<any> {
    try {
        const existingCase = await CaseHistoryModel.findOne(
            {
                case: caseId,
            },
            projection,
        )
            .populate({ path: 'case', model: CaseModel, select: projection })
            .populate({ path: 'volunteer', model: UserModel, select: projection })
            .exec()

        if (!existingCase)
            return Promise.reject(NotFound({ caseId: 'History does not exist.' }))

        return existingCase
    } catch (error) {
        return Promise.reject(error)
    }
}

/** Create one record */
async function createCaseHistory({
    fields,
}: {
    fields: Record<string, any>
}): Promise<any> {
    try {
        const newCaseHistory = new CaseHistoryModel(fields)
        const savedCase = await newCaseHistory.save()
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
