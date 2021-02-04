/* eslint-disable consistent-return,@typescript-eslint/no-misused-promises */
import { NextFunction, Request, Response, Router } from 'express'

import Controller from '../../interfaces/controller.interface'
import validationMiddleware from '../../middlewares/validation.middleware'
import { CreateUserDto } from './users.dto'
import { User } from './users.interface'
import UserService from './users.service'

export default class UsersController implements Controller {
    path = '/users'

    router = Router()

    protected constructor(readonly service: UserService) {
        this.initializeRouter()
    }

    static create(service: UserService) {
        return new UsersController(service)
    }

    private initializeRouter() {
        this.router.get(`${this.path}`, this.getUsers)

        this.router.get(`${this.path}/:id`, this.getUserById)

        this.router.post(
            `${this.path}`,
            validationMiddleware(CreateUserDto, 'body'),
            this.createUser,
        )

        this.router.put(
            `${this.path}/:id`,
            validationMiddleware(CreateUserDto, 'body', true),
            this.updateUser,
        )

        this.router.delete(`${this.path}/:id`, this.deleteUser)
    }

    getRouter() {
        return this.router
    }

    getUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const findAllUsersData: User[] = await this.service.findAllUser()

            res.status(200).json({ data: findAllUsersData, message: 'findAll' })
        } catch (error) {
            return next(error)
        }
    }

    getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.params.id
            const findOneUserData: User = await this.service.findUserById(userId)

            res.status(200).json({ data: findOneUserData, message: 'findOne' })
        } catch (error) {
            return next(error)
        }
    }

    createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: CreateUserDto = req.body
            const createUserData: User = await this.service.createUser(userData)

            res.status(201).json({ data: createUserData, message: 'created' })
        } catch (error) {
            return next(error)
        }
    }

    updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.params.id
            const userData: User = req.body

            const updateUserData: User = await this.service.updateUser(
                userId,
                userData,
            )

            res.status(200).json({ data: updateUserData, message: 'updated' })
        } catch (error) {
            return next(error)
        }
    }

    deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.params.id
            const deleteUserData: User = await this.service.deleteUserData(userId)

            res.status(200).json({ data: deleteUserData, message: 'deleted' })
        } catch (error) {
            return next(error)
        }
    }
}
