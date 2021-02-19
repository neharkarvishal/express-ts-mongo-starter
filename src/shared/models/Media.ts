import { Document, model, Schema } from 'mongoose'

export const MediaCollectionName = 'Media' as const

interface MediaDocument extends Document {
    _id: string
}

export const MediaSchema = new Schema(
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
            required: true,
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
            required: false,
        },
        referer: {
            type: {
                type: String,
                enum: ['CASE'],
            },
            object: Schema.Types.ObjectId,
        },
    },
    {
        timestamps: true,
        optimisticConcurrency: true,
    },
)

const MediaModel = model<MediaDocument>(MediaCollectionName, MediaSchema)

export default MediaModel
