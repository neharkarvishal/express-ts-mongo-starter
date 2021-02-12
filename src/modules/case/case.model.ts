import { Document, model, Schema } from 'mongoose'

import { PointSchema } from '../../shared/models/GeoJSONPoint'
import { PolygonSchema } from '../../shared/models/GeoJSONPolygon'

const CaseCollectionName = 'Case' as const

export interface CaseDocument extends Document {
    _id: string
    animalDetails: {
        type: string
        name?: string
        color?: string
        identificationMark: string
        image?: string
    }
    description?: string
    address?: string
    phoneNumber: string
    alternatePhoneNumber?: string
    point: Record<string, any>
    area?: Record<string, any>

    deletedAt: Date | null
}

export const CaseSchema = new Schema(
    {
        animalDetails: {
            type: {
                type: String,
                enum: ['DOG', 'CAT', 'UNKNOWN'],
                default: 'UNKNOWN',
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
            image: {
                type: Schema.Types.ObjectId,
                ref: 'Media',
                required: false,
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

const CaseModel = model<CaseDocument>(CaseCollectionName, CaseSchema)

export default CaseModel
