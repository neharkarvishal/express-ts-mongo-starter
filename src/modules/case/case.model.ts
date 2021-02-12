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
        animalDetails: {
            type: {
                type: String,
                enum: ['DOG', 'CAT', 'UNKNOWN'],
                default: 'unknown',
                required: true,
                trim: true,
                uppercase: true,
            },
            name: {
                type: String,
                required: false,
                trim: true,
                lowercase: true,
            },
            color: {
                type: String,
                required: false,
                trim: true,
                lowercase: true,
            },
            identificationMark: {
                type: String,
                required: false,
                trim: true,
                lowercase: true,
            },
        },
        description: {
            type: String,
            required: false,
            trim: true,
            lowercase: true,
        },
        address: {
            type: String,
            required: false,
            trim: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
            trim: true,
            required: true,
        },
        alternatePhoneNumber: {
            type: String,
            trim: true,
            required: false,
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
