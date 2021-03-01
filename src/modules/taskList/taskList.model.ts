import { Document, model, Schema } from 'mongoose'

export const TaskListCollectionName = 'TaskList' as const

export interface TaskListDocument extends Document {
    _id: string
    description?: string
    case?: string | Record<string, any>
    assignedTo?: string | Record<string, any>
    deletedAt: Date | null
}

export const TaskListSchema = new Schema(
    {
        completed: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Case',
                required: true,
            },
        ],
        current: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Case',
                required: true,
            },
        ],
        pending: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Case',
                required: true,
            },
        ],
    },
    {
        timestamps: true,
        optimisticConcurrency: true,
    },
)

const TaskListModel = model<TaskListDocument>(
    TaskListCollectionName,
    TaskListSchema,
)

export default TaskListModel
