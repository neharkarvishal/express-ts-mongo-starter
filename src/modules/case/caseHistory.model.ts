import { Document, model, Schema } from 'mongoose'

const CaseHistoryCollectionName = 'CaseHistory' as const

export interface CaseHistoryDocument extends Document {
    _id: string
    description?: string
    deletedAt: Date | null
}

export const CaseHistorySchema = new Schema(
    {
        description: {
            type: String,
            required: false,
            trim: true,
            lowercase: true,
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        optimisticConcurrency: true,
    },
)

const CaseHistoryModel = model<CaseHistoryDocument>(
    CaseHistoryCollectionName,
    CaseHistorySchema,
)

export default CaseHistoryModel
