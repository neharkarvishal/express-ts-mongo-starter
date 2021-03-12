import { Document, model, Schema } from 'mongoose'

export const EmailValidationCollectionName = 'EmailValidation' as const

export interface EmailValidationDocument extends Document {
    _id: string
    email: string
    token: string
}

export const EmailValidationSchema = new Schema(
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

const EmailValidationModel = model<EmailValidationDocument>(
    EmailValidationCollectionName,
    EmailValidationSchema,
)

export default EmailValidationModel
