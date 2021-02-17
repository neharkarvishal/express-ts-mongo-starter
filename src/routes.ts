import { Router } from 'express'
import mongoose from 'mongoose'

import caseController from './modules/case/case.controller'
import userController from './modules/users/user.controller'

const router = Router()

const routes = (options: { db: typeof mongoose }) => {
    router.use('/cases', caseController(options))
    router.use('/users', userController(options))

    return router
}

export default routes
