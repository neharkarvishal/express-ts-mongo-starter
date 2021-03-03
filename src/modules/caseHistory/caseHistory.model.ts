import { Document, model, Schema } from 'mongoose'
import autoPopulate from 'mongoose-autopopulate'

export const CaseHistoryCollectionName = 'CaseHistory' as const

export interface CaseHistoryDocument extends Document {
    _id: string
    description?: string
    case?: string | Record<string, any>
    assignedTo?: string | Record<string, any>
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
        assignedTo: {
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

CaseHistorySchema.plugin(autoPopulate)

const CaseHistoryModel = model<CaseHistoryDocument>(
    CaseHistoryCollectionName,
    CaseHistorySchema,
)

export default CaseHistoryModel
