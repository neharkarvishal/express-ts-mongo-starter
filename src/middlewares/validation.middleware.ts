/* eslint-disable @typescript-eslint/no-floating-promises */
import { plainToClass } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { RequestHandler } from 'express'

import HttpException from '../exceptions/HttpException'

const validationMiddleware = (
    type: any,
    valueFrom: string | 'body' | 'query' | 'params' = 'body',
    skipMissingProperties = false,
): RequestHandler => {
    return (req, res, next) => {
        validate(plainToClass(type, req[valueFrom]), {
            skipMissingProperties,
        }).then((errors: ValidationError[]) => {
            if (errors.length > 0) {
                return next(
                    new HttpException({
                        message: 'Invalid data',
                        status: 400,
                        errors: errors
                            .flatMap((e: ValidationError) =>
                                e?.constraints
                                    ? Object.values(e.constraints)
                                    : undefined,
                            )
                            .filter((i) => Boolean(i)),
                    }),
                )
            }
            return next()
        })
    }
}

export default validationMiddleware
