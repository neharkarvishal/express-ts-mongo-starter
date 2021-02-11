import { Document, model, Schema } from 'mongoose'

export interface ITag extends Document {
    _id: string
    name: string
    deletedAt: Date | null
}

export const TagSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
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

const TagModel = model<ITag>('Tag', TagSchema)

export default TagModel
