/* eslint-disable consistent-return,@typescript-eslint/no-misused-promises */
import { NextFunction, Request, Response, Router } from 'express'

import Controller from '../../interfaces/controller.interface'
import validationMiddleware from '../../middlewares/validation.middleware'
import { CreateUserDto } from './users.dto'
import { User } from './users.interface'
import UserService from './users.service'

type UsersControllerDeps = { userService: UserService }

export default class UsersController implements Controller {
    path: '/users' = '/users'

    router = Router()

    protected constructor(readonly userService: UserService) {
        this.initializeRouter()
    }

    static create({ userService }: UsersControllerDeps) {
        return new UsersController(userService)
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
            const data = await this.userService.findAllUser()

            res.done({ data })
        } catch (error) {
            return next(error)
        }
    }

    getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.params.id
            const data = await this.userService.findUserById(userId)

            res.done({ data })
        } catch (error) {
            return next(error)
        }
    }

    createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: CreateUserDto = req.body
            const data = await this.userService.createUser(userData)

            res.done({ data, code: 201 })
        } catch (error) {
            return next(error)
        }
    }

    updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.params.id
            const userData: User = req.body

            const data = await this.userService.updateUser(userId, userData)

            res.done({ data })
        } catch (error) {
            return next(error)
        }
    }

    deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.params.id
            const data = await this.userService.deleteUserData(userId)

            res.done({ data })
        } catch (error) {
            return next(error)
        }
    }
}
