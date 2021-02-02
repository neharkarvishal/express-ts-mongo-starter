import bcrypt from 'bcrypt'

import HttpException from '../../exceptions/HttpException'
import { isEmpty } from '../../utils/util'
import { CreateUserDto } from './users.dto'
import { User } from './users.interface'
import UserModel from './users.model'

class UserService {
    protected constructor(readonly model: typeof UserModel) {}

    static create(model: typeof UserModel) {
        return new UserService(model)
    }

    async findAllUser() {
        return this.model.find()
    }

    async findUserById(userId: string) {
        const findUser = await this.model.findOne({ _id: userId })
        if (!findUser) throw new HttpException(409, "You're not user")

        return findUser
    }

    async createUser(userData: CreateUserDto) {
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

    async updateUser(userId: string, userData: User) {
        if (isEmpty(userData)) throw new HttpException(400, "You're not userData")

        const hashedPassword = await bcrypt.hash(userData.password, 10)
        const updateUserById = await this.model.findByIdAndUpdate(userId, {
            ...userData,
            password: hashedPassword,
        })

        if (!updateUserById) throw new HttpException(409, "You're not user")

        return updateUserById
    }

    async deleteUserData(userId: string) {
        const deleteUserById = await this.model.findByIdAndDelete(userId)
        if (!deleteUserById) throw new HttpException(409, "You're not user")

        return deleteUserById
    }
}

export default UserService
