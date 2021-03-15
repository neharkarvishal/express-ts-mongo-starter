import { Document, model, Schema } from 'mongoose'

export const UserValidationCollectionName = 'UserValidation' as const

export interface UserValidationDocument extends Document {
    _id: string
    email: string
    token: string
    otp: string
    verifiedAt: Date | null
}

export const UserValidationSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        token: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        verifiedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        optimisticConcurrency: true,
    },
)

const UserValidationModel = model<UserValidationDocument>(
    UserValidationCollectionName,
    UserValidationSchema,
)

export default UserValidationModel
