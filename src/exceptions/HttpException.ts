interface HttpExceptionParams {
    message: string
    status?: number
    errors?: Record<string, unknown>
}

class HttpException extends Error {
    errors: Record<string, unknown>

    status: number

    constructor({ message, status = 500, errors = {} }: HttpExceptionParams) {
        super(message)
        this.status = status
        this.errors = errors
    }
}

export default HttpException
