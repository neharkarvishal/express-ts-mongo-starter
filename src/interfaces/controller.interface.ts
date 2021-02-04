import { Router } from 'express'

interface Controller {
    path: string
    router: Router

    getRouter: () => Router
}

export default Controller
