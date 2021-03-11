import { Document, model, Schema } from 'mongoose'

export const UploadCollectionName = 'Upload' as const

export interface UploadDocument extends Document {
    _id: string
    type: string
    url: string
    title: string
    size: number
    sizeHuman: string
    addedBy: string
    referer: {
        type: string
        object: string | Object | any
    }
}

export const UploadSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['IMAGE', 'VIDEO', 'SOUND', 'DOC'],
            required: true,
            trim: true,
            uppercase: true,
        },
        url: {
            type: String,
            required: false,
        },
        fileName: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        title: {
            type: String,
            required: false,
            trim: true,
            lowercase: true,
        },
        size: {
            type: Number,
            required: false,
        },
        sizeHuman: {
            type: String,
            required: false,
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        referer: {
            type: {
                type: String,
                enum: ['CASE', 'USER', 'NGO'],
            },
            object: Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true,
        optimisticConcurrency: true,
    },
)

const UploadModel = model<UploadDocument>(UploadCollectionName, UploadSchema)

export default UploadModel
