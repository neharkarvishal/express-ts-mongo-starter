import { Router } from 'express'
import mongoose from 'mongoose'

import caseController from './modules/case/case.controller'
import caseHistoryController from './modules/caseHistory/caseHistory.controller'
import ngoController from './modules/ngo/ngo.controller'
import userController from './modules/users/user.controller'

const router = Router()

const routes = (options: { db: typeof mongoose }) => {
    router.use('/cases', caseController(options))
    router.use('/cases-history', caseHistoryController(options))
    router.use('/users', userController(options))
    router.use('/ngos', ngoController(options))

    return router
}

export default routes
