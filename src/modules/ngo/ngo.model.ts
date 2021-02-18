import { Document, model, Schema } from 'mongoose'

import { PointSchema } from '../../shared/models/GeoJSONPoint'
import { PolygonSchema } from '../../shared/models/GeoJSONPolygon'

const NGOCollectionName = 'NGO' as const

export interface NGODocument extends Document {
    _id: string
    description?: string
    address?: string
    phoneNumber: string
    alternatePhoneNumber?: string
    point: Record<string, any>
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
        point: {
            type: PointSchema,
            required: false,
            index: '2dsphere', // Create a special 2dsphere index
        },
        area: {
            type: PolygonSchema,
            required: true,
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

const NgoModel = model<NGODocument>(NGOCollectionName, NGOSchema)

export default NgoModel
