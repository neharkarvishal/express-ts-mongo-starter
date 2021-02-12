import { Document, model, Schema } from 'mongoose'

import { PointSchema } from '../../shared/models/GeoJSONPoint'
import { PolygonSchema } from '../../shared/models/GeoJSONPolygon'
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
            required: false,
        },
        animalType: {
            type: String,
            enum: ['DOG', 'CAT', 'UNKNOWN'],
            default: 'UNKNOWN',
            required: true,
        },
        location: {
            latitude: String,
            longitude: String,
            address: String,
        },
        point: {
            type: PointSchema,
            required: false,
            index: '2dsphere', // Create a special 2dsphere index
        },
        area: {
            type: PolygonSchema,
            required: false,
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
