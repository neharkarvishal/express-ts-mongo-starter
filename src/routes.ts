import { Router } from 'express'
import mongoose from 'mongoose'

import caseController from './modules/case/case.controller'
import caseHistoryController from './modules/caseHistory/caseHistory.controller'
import ngoController from './modules/ngo/ngo.controller'
import uploadController from './modules/upload/upload.controller'
import userController from './modules/users/user.controller'

const router = Router()

const routes = (options: { db: typeof mongoose }) => {
    router.use('/upload', uploadController(options))
    router.use('/cases', caseController(options))
    // router.use('/auth', userController(options))
    router.use('/users', userController(options))
    router.use('/ngos', ngoController(options))
    router.use('/case-history', caseHistoryController(options))

    return router
}

export default routes
