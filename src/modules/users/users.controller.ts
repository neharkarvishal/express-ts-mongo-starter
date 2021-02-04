/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express'

import { CreateUserDto } from './users.dto'
import { User } from './users.interface'
import UserService from './users.service'

class UsersController {
    protected constructor(readonly service: UserService) {}

    static create(service: UserService) {
        return new UsersController(service)
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const findAllUsersData: User[] = await this.service.findAllUser()

            res.status(200).json({ data: findAllUsersData, message: 'findAll' })
        } catch (error) {
            return next(error)
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        const userId: string = req.params.id

        try {
            const findOneUserData: User = await this.service.findUserById(userId)

            res.status(200).json({ data: findOneUserData, message: 'findOne' })
        } catch (error) {
            return next(error)
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        const userData: CreateUserDto = req.body

        try {
            const createUserData: User = await this.service.createUser(userData)

            res.status(201).json({ data: createUserData, message: 'created' })
        } catch (error) {
            return next(error)
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        const userId: string = req.params.id
        const userData: User = req.body

        try {
            const updateUserData: User = await this.service.updateUser(
                userId,
                userData,
            )

            res.status(200).json({ data: updateUserData, message: 'updated' })
        } catch (error) {
            return next(error)
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        const userId: string = req.params.id

        try {
            const deleteUserData: User = await this.service.deleteUserData(userId)

            res.status(200).json({ data: deleteUserData, message: 'deleted' })
        } catch (error) {
            return next(error)
        }
    }
}

export default UsersController
