import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import HttpException, { BadRequest, Conflict } from '../../exceptions/HttpException'
import { isEmpty } from '../../utils/util'
import { CreateUserDto } from '../users/users.dto'
import { User } from '../users/users.interface'
import UserModel from '../users/users.model'
import { DataStoredInToken, TokenData } from './auth.interface'

class AuthService {
    protected constructor(readonly model: typeof UserModel) {}

    static create(model: typeof UserModel) {
        return new AuthService(model)
    }

    async login(userData: CreateUserDto) {
        if (isEmpty(userData))
            return Promise.reject(BadRequest({ message: 'Invalid user data' }))

        const findUser = await this.model.findOne({ email: userData.email })

        if (!findUser)
            return Promise.reject(BadRequest({ message: 'Invalid user data' }))

        const isPasswordMatching: boolean = await bcrypt.compare(
            userData.password,
            findUser.password,
        )

        if (!isPasswordMatching)
            return Promise.reject(
                BadRequest({ message: 'Wrong username or password' }),
            )

        const tokenData = this.createToken(findUser)
        const cookie = this.createCookie(tokenData)

        return { cookie, findUser }
    }

    async logout(userData: User) {
        if (isEmpty(userData))
            return Promise.reject(BadRequest({ message: 'Invalid user data' }))

        return userData
    }

    createToken(user: User) {
        const dataStoredInToken: DataStoredInToken = { _id: user._id }
        const secret = process.env.JWT_SECRET as string
        const expiresIn: number = 60 * 60

        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        } as TokenData
    }

    createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`
    }
}

export default AuthService
