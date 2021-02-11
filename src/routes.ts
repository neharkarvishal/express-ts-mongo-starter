import { Router } from 'express'
import mongoose from 'mongoose'

import tagsController from './modules/tags/tags.controller'

const router = Router()

const routes = (options: { db: typeof mongoose }) => {
    router.use('/tags', tagsController(options))

    return router
}

export default routes
