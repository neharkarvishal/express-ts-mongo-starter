import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import HttpException from '../../exceptions/HttpException'
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

    async signup(userData: CreateUserDto) {
        if (isEmpty(userData)) throw new HttpException(400, "You're not userData")

        const findUser = await this.model.findOne({ email: userData.email })

        if (findUser)
            throw new HttpException(
                409,
                `You're email ${userData.email} already exists`,
            )

        const hashedPassword = await bcrypt.hash(userData.password, 10)

        return this.model.create({
            ...userData,
            password: hashedPassword,
        })
    }

    async login(userData: CreateUserDto) {
        if (isEmpty(userData)) throw new HttpException(400, "You're not userData")

        const findUser = await this.model.findOne({ email: userData.email })

        if (!findUser)
            throw new HttpException(409, `You're email ${userData.email} not found`)

        const isPasswordMatching: boolean = await bcrypt.compare(
            userData.password,
            findUser.password,
        )

        if (!isPasswordMatching)
            throw new HttpException(409, "You're password not matching")

        const tokenData = this.createToken(findUser)
        const cookie = this.createCookie(tokenData)

        return { cookie, findUser }
    }

    async logout(userData: User) {
        if (isEmpty(userData)) throw new HttpException(400, "You're not userData")

        const findUser = await this.model.findOne({
            password: userData.password,
        })

        if (!findUser) throw new HttpException(409, "You're not user")

        return findUser
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
