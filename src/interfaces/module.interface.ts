import { Router } from 'express'

interface Module {
    path?: string
    router: Router

    getRouter: () => Router
}

export default Module
