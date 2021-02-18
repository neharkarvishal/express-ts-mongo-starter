import { Document, model, Schema } from 'mongoose'

import { PointSchema } from '../../shared/models/GeoJSONPoint'
import { PolygonSchema } from '../../shared/models/GeoJSONPolygon'
import { NGOSchema } from '../ngo/ngo.model'

const CaseCollectionName = 'Case' as const

export interface CaseDocument extends Document {
    _id: string
    status: string
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

    deletedAt: Date | null
}

export const CaseSchema = new Schema(
    {
        status: {
            type: String,
            enum: ['OPEN', 'PENDING', 'CLOSED', 'ABANDONED', 'REOPENED'],
            default: 'OPEN',
            required: true,
            trim: true,
            uppercase: true,
        },
        type: {
            type: String,
            enum: ['INJURY', 'ABUSE', 'CLOSED', 'ATTACK', 'OTHER'],
            default: 'INJURY',
            required: true,
            trim: true,
            uppercase: true,
        },
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
            type: {
                type: String, // Don't do `{ location: { type: String } }`
                enum: ['Point'], // 'location.type' must be 'Point'
                default: 'Point',
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
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

CaseSchema.index({ point: '2dsphere' })

const CaseModel = model<CaseDocument>(CaseCollectionName, CaseSchema)

export default CaseModel
