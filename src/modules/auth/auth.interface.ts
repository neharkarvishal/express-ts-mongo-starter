import { Request } from 'express'

import { User } from '../users/users.interface'

export interface DataStoredInToken {
    _id: string
}

export interface TokenData {
    token: string
    expiresIn: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RequestWithUser extends Request {
    // user: User
}
