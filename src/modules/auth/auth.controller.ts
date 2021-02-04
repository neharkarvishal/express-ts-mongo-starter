/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express'

import { CreateUserDto } from '../users/users.dto'
import { User } from '../users/users.interface'
import { RequestWithUser } from './auth.interface'
import AuthService from './auth.service'

class AuthController {
    protected constructor(readonly service: AuthService) {}

    static create(service: AuthService) {
        return new AuthController(service)
    }

    async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const userData: CreateUserDto = req.body
            const signUpUserData: User = await this.service.signup(userData)

            res.status(201).json({ data: signUpUserData, message: 'signup' })
        } catch (error) {
            return next(error)
        }
    }

    async logIn(req: Request, res: Response, next: NextFunction) {
        try {
            const userData: CreateUserDto = req.body
            const { cookie, findUser } = await this.service.login(userData)

            res.setHeader('Set-Cookie', [cookie])
            res.status(200).json({ data: findUser, message: 'login' })
        } catch (error) {
            return next(error)
        }
    }

    async logOut(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            res.setHeader('Set-Cookie', ['Authorization=; Max-age=0'])
            res.status(200).json({ message: 'logout' })
        } catch (error) {
            return next(error)
        }
    }
}

export default AuthController
