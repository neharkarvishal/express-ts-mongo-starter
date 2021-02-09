interface HttpExceptionParams {
    message: string
    status?: number
    errors?: any
}

export default class HttpException extends Error {
    errors: any

    status: number

    stack?: any

    constructor({ message, status = 500, errors }: HttpExceptionParams) {
        super(message)
        this.status = status

        if (errors && Object.keys(errors).length) this.errors = errors
    }
}

export const createError = ({ message, errors, status }) =>
    new HttpException({ message, errors, status })

export const BadRequest = (errors) =>
    new HttpException({ message: 'Bad Request', status: 400, errors })

export const Unauthorized = (errors) =>
    new HttpException({ message: 'Unauthorized', status: 401, errors })

export const Forbidden = (errors) =>
    new HttpException({ message: 'Forbidden', status: 403, errors })

export const NotFound = (errors) =>
    new HttpException({ message: 'Not Found', status: 404, errors })

export const Conflict = (errors) =>
    new HttpException({ message: 'Conflict', status: 409, errors })

export const TooManyRequests = (errors) =>
    new HttpException({ message: 'Too Many Requests', status: 429, errors })

export const InternalServerError = (errors) =>
    new HttpException({ message: 'Internal Server Error', status: 500, errors })
