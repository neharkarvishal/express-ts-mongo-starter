import { plainToClass } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { RequestHandler } from 'express'

import HttpException from '../exceptions/HttpException'

const validationMiddleware = (
    type: any,
    value: string | 'body' | 'query' | 'params' = 'body',
    skipMissingProperties = false,
): RequestHandler => {
    return (req, res, next) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        validate(plainToClass(type, req[value]), { skipMissingProperties }).then(
            (errors: ValidationError[]) => {
                if (errors.length > 0) {
                    const message = errors
                        .map((error: ValidationError) =>
                            // @ts-ignore
                            Object.values(error.constraints),
                        )
                        .join(', ')
                    next(new HttpException({ message, status: 400 }))
                } else {
                    return next()
                }
            },
        )
    }
}

export default validationMiddleware
