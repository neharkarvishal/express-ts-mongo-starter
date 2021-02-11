/* eslint-disable consistent-return,@typescript-eslint/no-misused-promises */
import { NextFunction, Request, Response, Router } from 'express'
import mongoose from 'mongoose'

const router = Router()

const handler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.done({ data: { message: 'Helloworld' } })
    } catch (error) {
        return next(error)
    }
}

const authController = (options: { db: typeof mongoose }) => {
    router.get('/', handler)

    return router
}

export default authController
