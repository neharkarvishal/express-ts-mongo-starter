import { Document, model, Schema } from 'mongoose'
import autoPopulate from 'mongoose-autopopulate'

import { CaseHistoryCollectionName } from '../caseHistory/caseHistory.model'
import { NGOCollectionName } from '../ngo/ngo.model'
import { UploadCollectionName } from '../upload/upload.model'
import { UserCollectionName } from '../users/user.model'

export const CaseCollectionName = 'Case' as const

export interface CaseDocument extends Document {
    _id: string
    status: string
    type: string
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
    addedBy: string
    assignedTo: string
    assignedNgo: string
    history: string[]
    scheduled: string
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
                ref: UploadCollectionName,
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
            ref: UserCollectionName,
            required: false,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: UserCollectionName,
            required: false,
        },
        assignedNgo: {
            type: Schema.Types.ObjectId,
            ref: NGOCollectionName,
            required: false,
        },
        history: [
            {
                type: Schema.Types.ObjectId,
                ref: CaseHistoryCollectionName,
                required: false,
            },
        ],
        scheduled: {
            type: Date,
            default: Date.now,
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

CaseSchema.plugin(autoPopulate)

const CaseModel = model<CaseDocument>(CaseCollectionName, CaseSchema)

export default CaseModel
