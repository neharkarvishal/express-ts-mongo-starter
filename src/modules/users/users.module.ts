import { Router } from 'express'

import Module from '../../interfaces/module.interface'
import validationMiddleware from '../../middlewares/validation.middleware'
import UsersController from './users.controller'
import { CreateUserDto } from './users.dto'

class UsersModule implements Module {
    path = '/users'

    router = Router()

    protected constructor(readonly controller: UsersController) {
        this.initializeRoutes()
    }

    static create(controller: UsersController) {
        return new UsersModule(controller)
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.controller.getUsers)

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

        this.router.delete(`${this.path}/:id`, this.controller.deleteUser)
    }
}

export default UsersModule
