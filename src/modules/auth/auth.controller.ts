/* eslint-disable @typescript-eslint/no-misused-promises */
import { NextFunction, Request, Response, Router } from 'express'

import Controller from '../../interfaces/controller.interface'
import authMiddleware from '../../middlewares/auth.middleware'
import validationMiddleware from '../../middlewares/validation.middleware'
import { CreateUserDto } from '../users/users.dto'
import { User } from '../users/users.interface'
import UserService from '../users/users.service'
import { RequestWithUser } from './auth.interface'
import AuthService from './auth.service'

type AuthControllerDeps = {
    readonly authService: AuthService
    readonly userService: UserService
}

class AuthController implements Controller {
    path: '/auth' = '/auth'

    router = Router()

    protected constructor(
        readonly authService: AuthService,
        readonly userService: UserService,
    ) {
        this.initializeRouter()
    }

    static create({ authService, userService }: AuthControllerDeps) {
        return new AuthController(authService, userService)
    }

    private initializeRouter() {
        this.router.post(
            '/signup',
            validationMiddleware(CreateUserDto, 'body'),
            this.signUp,
        )

        this.router.post(
            '/login',
            validationMiddleware(CreateUserDto, 'body'),
            this.logIn,
        )

        this.router.post('/logout', authMiddleware, this.logOut)
    }

    getRouter() {
        return this.router
    }

    signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: CreateUserDto = req.body
            const data = await this.userService.createUser(userData)

            res.done({ code: 201, data })
        } catch (error) {
            return next(error)
        }
    }

    logIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: CreateUserDto = req.body
            const { cookie, findUser: data } = await this.authService.login(
                userData,
            )

            res.setHeader('Set-Cookie', [cookie])
            res.done({ data, code: 200 })
        } catch (error) {
            return next(error)
        }
    }

    logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            res.setHeader('Set-Cookie', ['Authorization=; Max-age=0'])
            res.status(200).json({ message: 'logout' })
        } catch (error) {
            return next(error)
        }
    }
}

export default AuthController
