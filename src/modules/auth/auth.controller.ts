/* eslint-disable @typescript-eslint/no-misused-promises */
import { NextFunction, Request, Response, Router } from 'express'

import Controller from '../../interfaces/controller.interface'
import authMiddleware from '../../middlewares/auth.middleware'
import validationMiddleware from '../../middlewares/validation.middleware'
import { CreateUserDto } from '../users/users.dto'
import { User } from '../users/users.interface'
import { RequestWithUser } from './auth.interface'
import AuthService from './auth.service'

class AuthController implements Controller {
    path: '/auth' = '/auth'

    router = Router()

    protected constructor(readonly service: AuthService) {
        this.initializeRouter()
    }

    static create(service: AuthService) {
        return new AuthController(service)
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
            const signUpUserData: User = await this.service.signup(userData)

            res.status(201).json({ data: signUpUserData, message: 'signup' })
        } catch (error) {
            return next(error)
        }
    }

    logIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: CreateUserDto = req.body
            const { cookie, findUser } = await this.service.login(userData)

            res.setHeader('Set-Cookie', [cookie])
            res.status(200).json({ data: findUser, message: 'login' })
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
