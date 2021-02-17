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
            required: true,
            trim: true,
            lowercase: true,
        },
        case: {
            type: Schema.Types.ObjectId,
            ref: 'Case',
            required: true,
        },
        volunteer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
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
