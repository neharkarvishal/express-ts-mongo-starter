declare namespace Express {
    interface Request {
        user: Record<string, unknown>
    }
}

declare namespace IORedis {
    interface Redis {
        remember(...args): any
        put(...args): any
        purge(...args): any
    }
}
