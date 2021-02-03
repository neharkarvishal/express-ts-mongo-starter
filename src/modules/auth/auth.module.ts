import { Router } from 'express'

import Module from '../../interfaces/module.interface'
import authMiddleware from '../../middlewares/auth.middleware'
import validationMiddleware from '../../middlewares/validation.middleware'
import { CreateUserDto } from '../users/users.dto'
import AuthController from './auth.controller'

class AuthModule implements Module {
    router = Router()

    protected constructor(readonly controller: AuthController) {
        this.initializeRouter()
    }

    static create(controller: AuthController) {
        return new AuthModule(controller)
    }

    private initializeRouter() {
        this.router.post(
            '/signup',
            validationMiddleware(CreateUserDto, 'body'),
            this.controller.signUp,
        )

        this.router.post(
            '/login',
            validationMiddleware(CreateUserDto, 'body'),
            this.controller.logIn,
        )

        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.router.post('/logout', authMiddleware, this.controller.logOut)
    }
}

export default AuthModule
