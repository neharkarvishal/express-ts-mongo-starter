interface HttpExceptionParams {
    message: string
    status?: number
    errors?: any
}

class HttpException extends Error {
    errors: any

    status: number

    stack?: any

    constructor({ message, status = 500, errors = {} }: HttpExceptionParams) {
        super(message)
        this.status = status
        this.errors = errors
    }
}

export default HttpException
