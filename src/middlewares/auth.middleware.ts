import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'

import HttpException from '../exceptions/HttpException'
import { DataStoredInToken, RequestWithUser } from '../modules/auth/auth.interface'
import UserModel from '../modules/users/users.model'

const authMiddleware = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { cookies } = req

        if (cookies && cookies.Authorization) {
            const secret = process.env.JWT_SECRET

            // eslint-disable-next-line @typescript-eslint/await-thenable
            const verificationResponse = (await jwt.verify(
                cookies.Authorization, // @ts-ignore
                secret,
            )) as DataStoredInToken

            const userId = verificationResponse._id
            const findUser = await UserModel.findById(userId)

            if (findUser) {
                req.user = findUser

                return next()
            }

            return next(new HttpException(401, 'Wrong authentication token'))
        }

        return next(new HttpException(404, 'Authentication token missing'))
    } catch (error) {
        return next(new HttpException(401, 'Wrong authentication token'))
    }
}

export default authMiddleware
