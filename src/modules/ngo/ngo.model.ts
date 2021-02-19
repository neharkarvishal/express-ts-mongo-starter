import { Document, model, Schema } from 'mongoose'

import { PointSchema } from '../../shared/models/GeoJSONPoint'
import { PolygonSchema } from '../../shared/models/GeoJSONPolygon'

export const NGOCollectionName = 'NGO' as const

export interface NGODocument extends Document {
    _id: string
    description?: string
    address?: string
    phoneNumber: string
    alternatePhoneNumber?: string
    area?: Record<string, any>

    deletedAt: Date | null
}

export const NGOSchema = new Schema(
    {
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
        area: {
            type: {
                type: String,
                enum: ['Polygon'],
                default: 'Point',
                required: true,
            },
            coordinates: {
                type: [[[Number]]], // Array of arrays of arrays of coordinate numbers
                required: true,
            },
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

NGOSchema.index({ area: '2dsphere' })

const NgoModel = model<NGODocument>(NGOCollectionName, NGOSchema)

export default NgoModel
