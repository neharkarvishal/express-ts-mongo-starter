import { Document, model, Schema } from 'mongoose'
import autoPopulate from 'mongoose-autopopulate'

import { NGOCollectionName } from '../ngo/ngo.model'

export const UserCollectionName = 'User' as const

export interface User extends Document {
    _id: string
    email: string
    password: string
    name?: string
    emailVerifiedAt: Date
    status?: string
    roles: string[]
    ngo: string
    phoneNumber: string
    alternatePhoneNumber?: string
    point: Record<string, any>
    deletedAt: Date | null
}

export const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: false,
            trim: true,
            lowercase: true,
        },
        emailVerifiedAt: Date,
        status: {
            type: String,
            enum: ['NOT_ACTIVATED', 'ACTIVATED', 'DISABLED', 'DELETED'],
            default: 'NOT_ACTIVATED',
            required: true,
            trim: true,
            uppercase: true,
        },
        roles: {
            type: [String],
            // enum: ['ADMIN', 'NGO_ADMIN', 'NGO_FO', 'VOLUNTEER', 'USER'],
            default: ['USER'],
            required: true,
            set: (r: string[]) => r.sort(),
        },
        ngo: {
            type: Schema.Types.ObjectId,
            ref: NGOCollectionName,
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
        phoneNumber: { type: String, required: false },
        alternatePhoneNumber: { type: String, required: false },
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

UserSchema.plugin(autoPopulate)

const UserModel = model<User>(UserCollectionName, UserSchema)

export default UserModel
