declare namespace Express {
    interface Request {
        user: Record<string, unknown>
    }

    interface Response {
        done(options: {
            data: Record<any, any> | Array<any>
            paging?: Record<string, unknown>
            code?: 200 | number
            message?: string
            status?: 'success' | 'error'
        })
    }
}

declare namespace IORedis {
    interface Redis {
        remember(...args): any
        put(...args): any
        purge(...args): any
    }
}
