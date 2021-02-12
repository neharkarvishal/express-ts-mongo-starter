import { Document, model, Schema } from 'mongoose'

import { CaseInterface } from './case.interface'

const CaseCollectionName = 'case' as const

export interface CaseDocument extends CaseInterface, Document {
    _id: string
    deletedAt: Date | null
}

export const CaseSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
)

const CaseModel = model<CaseDocument>(CaseCollectionName, CaseSchema)

export default CaseModel
