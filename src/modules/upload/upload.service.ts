import fs from 'fs'

import { NotFound } from '../../exceptions/ApiException'
import { logger } from '../../utils/logger'
import UploadModel from './upload.model'

const logCases = { tags: ['BACKEND', 'CASE-HISTORY-SERVICE'] }
const projection = {
    __v: 0,
    // createdAt: 0,
    updatedAt: 0,
    deletedAt: 0,
    password: 0,
}

/** Get single record by id */
async function getUpload({ id }: { id: string }) {
    try {
        const existing = await UploadModel.find(
            {
                _id: id,
            },
            projection,
        ).exec()

        if (!existing) throw NotFound({ caseId: 'Upload does not exist.' })

        return existing
    } catch (e) {
        return Promise.reject(e)
    }
}

/** Create one record */
async function createUpload({ fields }: { fields: Record<string, any> }) {
    try {
        return []
    } catch (e) {
        logger.error(`Case create failed`, logCases)
        return Promise.reject(e)
    }
}

/** Create one record */
async function updateUpload({
    id,
    fields,
}: {
    id: string
    fields: Record<string, any>
}) {
    try {
        return []
    } catch (e) {
        logger.error(`Case update failed`, logCases)
        return Promise.reject(e)
    }
}

/** Service */
function uploadService() {
    return {
        getUpload,
        createUpload,
        updateUpload,
    }
}

export default uploadService
