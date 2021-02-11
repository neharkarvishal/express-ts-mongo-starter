interface HttpExceptionParams {
    message: string
    status?: number
    errors?: any
}

export default class ApiException extends Error {
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
    new ApiException({ message, errors, status })

export const BadRequest = (errors) =>
    new ApiException({ message: 'Bad Request', status: 400, errors })

export const Unauthorized = (errors) =>
    new ApiException({ message: 'Unauthorized', status: 401, errors })

export const Forbidden = (errors) =>
    new ApiException({ message: 'Forbidden', status: 403, errors })

export const NotFound = (errors = undefined) =>
    new ApiException({ message: 'Not Found', status: 404, errors })

export const Conflict = (errors) =>
    new ApiException({ message: 'Conflict', status: 409, errors })

export const TooManyRequests = (errors) =>
    new ApiException({ message: 'Too Many Requests', status: 429, errors })

export const InternalServerError = (errors) =>
    new ApiException({ message: 'Internal Server Error', status: 500, errors })
