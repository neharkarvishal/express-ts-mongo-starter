import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

import ApiException, {
    BadRequest,
    Conflict,
    NotFound,
} from '../../exceptions/ApiException'
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
        const user = await this.model.findOne({ _id: userId })

        if (!user) return Promise.reject(NotFound({ message: 'User not found' }))

        return user
    }

    async createUser(userData: CreateUserDto) {
        if (isEmpty(userData))
            return Promise.reject(BadRequest({ message: 'Invalid user data' }))

        const findUser = await this.model.findOne({ email: userData.email })

        if (findUser)
            return Promise.reject(
                Conflict({ message: `Email ${userData.email} already exists` }),
            )

        const hashedPassword = await bcrypt.hash(userData.password, 10)

        // @ts-ignore
        const saved = await this.model.create({
            ...userData,
            password: hashedPassword,
        })

        const { __v, createdAt, updatedAt, password, ...user } = saved.toObject()

        return user as ObjectOf<Partial<typeof UserModel>>
    }

    async updateUser(userId: string, userData: User) {
        if (isEmpty(userData))
            throw new ApiException({ status: 400, message: 'Invalid user data' })

        const hashedPassword = await bcrypt.hash(userData.password, 10)
        const updateUserById = await this.model.findByIdAndUpdate(userId, {
            ...userData,
            password: hashedPassword,
        })

        if (!updateUserById)
            return Promise.reject(BadRequest({ message: 'Invalid user data' }))

        return updateUserById
    }

    async deleteUserData(userId: string) {
        const deleteUserById = await this.model.findByIdAndDelete(userId)

        if (!deleteUserById)
            throw new ApiException({ status: 400, message: 'Invalid user data' })

        return deleteUserById
    }
}

export default UserService
