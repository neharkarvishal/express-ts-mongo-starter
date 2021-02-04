import { NextFunction, Request, Response, Router } from 'express'

import Controller from '../../interfaces/controller.interface'

export default class HomeController implements Controller {
    path = '/'

    router = Router()

    private constructor() {
        this.initializeRouter()
    }

    static create() {
        return new HomeController()
    }

    getRouter() {
        return this.router
    }

    private initializeRouter() {
        this.router.get(`${this.path}`, this.index)
    }

    index = (req: Request, res: Response, next: NextFunction) => {
        try {
            res.sendStatus(200)
        } catch (error) {
            return next(error)
        }
    }
}
