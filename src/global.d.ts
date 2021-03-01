declare namespace Express {
    interface Request {
        user: Record<string, unknown>
    }

    interface Response {
        done(options: {
            data: Record<any, any> | Array<any> | any
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

// Non Function Property Names
type NonFunctionProperties<T> = {
    [K in keyof T]: T[K] extends Function ? never : K
}[keyof T]

type PropertiesOf<T> = Pick<T, NonFunctionProperties<T>>
type ObjectOf<T> = Pick<T, NonFunctionProperties<T>>
type JsonOf<T> = Pick<T, NonFunctionProperties<T>>

// scratch
declare namespace API {
    interface Case {}

    interface CaseApi {
        get: {
            '/cases/': { getAll(): Case[] }
            '/cases/raw': { getAllRaw(): Case[] }
            '/cases/:id': { getOneById(): Case[] }
        }
    }
}
