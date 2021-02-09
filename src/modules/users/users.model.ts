import crypto from 'crypto'
import { Document, model, Schema } from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

import { User } from './users.interface'

export const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: false,
        },
        emailVerifiedAt: Date,
        salt: String,
        status: String,
        roles: [String],
        mobileNumber: String,
    },
    {
        timestamps: true,
    },
)

// pbkdf2 configurations
const iterationCount = 1000
const keylen = 64
const digest = 'sha512'

// pre hook to hash plain password
// UserSchema.pre<User & Document>('save', function preSaveHook(next) {
//     if (this.isModified('password') || this.isNew) {
//         const user = this // eslint-disable-line @typescript-eslint/no-this-alias
//
//         // get a salt for password hashing
//         const salt = uuidv4()
//
//         crypto.pbkdf2(
//             user.password,
//             salt,
//             iterationCount,
//             keylen,
//             digest,
//             (cryptoErr, derivedKey) => {
//                 if (cryptoErr) {
//                     next(cryptoErr)
//                     return
//                 }
//
//                 // assign generated key and salt to user
//                 user.password = derivedKey.toString('hex')
//                 user.salt = salt
//
//                 // continue
//                 next()
//             },
//         )
//     } else {
//         next()
//     }
// })

const UserModel = model<User>('User', UserSchema)

export default UserModel
