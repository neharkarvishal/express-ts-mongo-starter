export class ApiError extends Error {
    constructor(message, code = 500, errors = {}, status = 'error') {
        super(message)

        this.name = 'ApiError'

        this.status = status
        this.code = code
        this.errors = errors
    }
}

export const createError = ({ message, code, errors, status }) =>
    new ApiError(message, code, errors, status)

export const Forbidden = (errors = {}) => new ApiError('Forbidden', 403, errors)

export const NotFound = (errors = {}) => new ApiError('Not Found', 404, errors)

export const Conflict = (errors = {}) => new ApiError('Conflict', 409, errors)

export const BadRequest = (errors = {}) => new ApiError('Bad Request', 400, errors)

export const Unauthorized = (errors = {}) =>
    new ApiError('Unauthorized', 401, errors)

export const TooManyRequests = (errors = {}) =>
    new ApiError('Too Many Requests', 429, errors)

export const InternalServerError = (errors = {}) =>
    new ApiError('Internal Server Error', 500, errors)
