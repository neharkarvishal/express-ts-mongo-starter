import crypto from 'crypto'
import { Document, model, Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

export const UserCollectionName = 'User' as const

export interface User extends Document {
    _id: string
    email: string
    password: string
    role: string[]
    name?: string
    description?: string
    address?: string
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

const UserModel = model<User>(UserCollectionName, UserSchema)

export default UserModel
