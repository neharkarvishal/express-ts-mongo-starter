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

/** `createError` helper for custom errors */
export const createError = ({ message, errors, status }) =>
    new ApiException({ message, errors, status })

export const BadRequest = (errors: unknown) =>
    new ApiException({ message: 'Bad Request', status: 400, errors })

export const Unauthorized = (errors: unknown) =>
    new ApiException({ message: 'Unauthorized', status: 401, errors })

export const Forbidden = (errors: unknown) =>
    new ApiException({ message: 'Forbidden', status: 403, errors })

export const NotFound = (errors: unknown) =>
    new ApiException({ message: 'Not Found', status: 404, errors })

export const Conflict = (errors: unknown) =>
    new ApiException({ message: 'Conflict', status: 409, errors })

export const TooManyRequests = (errors: unknown) =>
    new ApiException({ message: 'Too Many Requests', status: 429, errors })

export const InternalServerError = (errors: unknown) =>
    new ApiException({ message: 'Internal Server Error', status: 500, errors })
