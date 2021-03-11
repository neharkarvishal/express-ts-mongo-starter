/* eslint-disable no-nested-ternary */
import { NotFound } from '../../exceptions/ApiException'
import { logger } from '../../utils/logger'
import CaseModel from '../case/case.model'
import NgoModel, { NGOCollectionName } from '../ngo/ngo.model'
import UserModel, { UserCollectionName } from '../users/user.model'
import UploadModel from './upload.model'

const logUploads = { tags: ['BACKEND', 'UPLOAD-SERVICE'] }
const projection = {
    __v: 0,
    // createdAt: 0,
    updatedAt: 0,
    deletedAt: 0,
    password: 0,
}

/** Get single record by id */
async function getUpload({ id }: { readonly id: string }) {
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
async function avatarUpload({
    body = {},
    file = {},
    user = {},
}: {
    body: Record<string, any>
    file: Partial<UploadFileType>
    user: Record<string, any>
}) {
    try {
        const fields = {
            fileName: file?.filename ?? body?.title ?? '',
            title: body?.title ?? file?.filename ?? '',
            addedBy: user?._id ?? null,
            size: file?.size ?? 0,
            type: 'IMAGE',
            referer: {
                type: UserCollectionName.toUpperCase(),
                object: user?._id ?? null,
            },
        }

        const uploadFile = new UploadModel(fields)
        await uploadFile.save()
        const savedNGO = await uploadFile.save()

        await savedNGO
            .populate({
                path: 'addedBy',
                model: UserModel,
                select: projection,
            })
            .populate({
                path: 'referer.object',
                model: UserModel,
                select: projection,
            })
            .execPopulate()

        logger.info(`Upload saved: ${savedNGO._id}`, logUploads)

        const {
            __v,
            createdAt,
            updatedAt,
            deletedAt,
            ...data
        } = savedNGO.toObject()

        return data
    } catch (e) {
        logger.error(`Case create failed`, logUploads)
        return Promise.reject(e)
    }
}

/** Create one record */
async function updateUpload({
    id,
    fields,
}: {
    readonly id: string
    fields: Record<string, any>
}) {
    try {
        return []
    } catch (e) {
        logger.error(`Case update failed`, logUploads)
        return Promise.reject(e)
    }
}

/** Service */
function uploadService() {
    return {
        getUpload,
        avatarUpload,
        updateUpload,
    }
}

export default uploadService
