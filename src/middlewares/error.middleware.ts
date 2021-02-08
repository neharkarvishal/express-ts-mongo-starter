import { NextFunction, Request, Response } from 'express'

import HttpException from '../exceptions/HttpException'
import { logger } from '../utils/logger'

// error handler
const bodyParserErrorTypes = [
    'encoding.unsupported',
    'request.aborted',
    'entity.too.large',
    'request.size.invalid',
    'stream.encoding.set',
    'parameters.too.many',
    'charset.unsupported',
    'encoding.unsupported',
    'entity.verify.failed',
    'entity.parse.failed',
]

const errorMiddleware = (
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (error instanceof HttpException) {
            res.status(error.status).json({
                message: error.message,
                status: error.status,
                errors: error.errors,
            })
            return
        }

        const { status = 500, message, stack, errors = {} } = error

        logger.error(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `StatusCode : ${status}, Message : ${message} \n${
                stack ?? 'NO STACKTRACE'
            }`,
        )

        const response = {
            status,
            message,
        }

        if (process.env.NODE_ENV !== 'development') {
            // @ts-ignore
            response.message = // @ts-ignore Check error related for request body
                bodyParserErrorTypes.indexOf(error?.type) === -1
                    ? 'Something went wrong'
                    : 'Something wrong in request'
        } else {
            // @ts-ignore only providing error in development
            response.stack = stack // @ts-ignore
            response.message = message // @ts-ignore
            if (Object.keys(errors).length) response.errors = errors
        }

        res.status(status).json(response)
    } catch (e) {
        return next(e)
    }
}

export default errorMiddleware
