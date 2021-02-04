import { Router } from 'express'

import Module from '../../interfaces/module.interface'
import validationMiddleware from '../../middlewares/validation.middleware'
import UsersController from './users.controller'
import { CreateUserDto } from './users.dto'

class UsersModule implements Module {
    path = '/users'

    router = Router()

    protected constructor(readonly controller: UsersController) {
        this.initializeRouter()
    }

    static create(controller: UsersController) {
        return new UsersModule(controller)
    }

    getRouter() {
        return this.router
    }

    private initializeRouter() {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.router.get(`${this.path}`, this.controller.getUsers)

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.router.get(`${this.path}/:id`, this.controller.getUserById)

        this.router.post(
            `${this.path}`,
            validationMiddleware(CreateUserDto, 'body'),
            this.controller.createUser,
        )

        this.router.put(
            `${this.path}/:id`,
            validationMiddleware(CreateUserDto, 'body', true),
            this.controller.updateUser,
        )

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.router.delete(`${this.path}/:id`, this.controller.deleteUser)
    }
}

export default UsersModule
