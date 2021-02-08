import { Document, model, Schema } from 'mongoose'

import { User } from './users.interface'

export const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
})

const UserModel = model<User & Document>('User', UserSchema)

export default UserModel
