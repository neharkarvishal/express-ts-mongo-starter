import { Router } from 'express'

import Module from '../../interfaces/module.interface'
import HomeController from './home.controller'

class HomeModule implements Module {
    path = '/'

    router = Router()

    private constructor(readonly controller: HomeController) {
        this.initializeRouter()
    }

    static create(controller: HomeController) {
        return new HomeModule(controller)
    }

    private initializeRouter() {
        this.router.get(`${this.path}`, this.controller.index)
    }
}

export default HomeModule
