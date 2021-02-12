import { Router } from 'express'
import mongoose from 'mongoose'

import caseController from './modules/case/case.controller'

const router = Router()

const routes = (options: { db: typeof mongoose }) => {
    router.use('/cases', caseController(options))

    return router
}

export default routes
