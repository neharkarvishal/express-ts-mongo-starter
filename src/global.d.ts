type RoleType = 'ADMIN' | 'NGO_ADMIN' | 'NGO_FO' | 'VOLUNTEER' | 'USER'

type UploadFileType = {
    /** Name of the form field associated with this file. */
    fieldname: string

    /** Name of the file on the uploader's computer, with extension */
    originalname: string

    /** * Value of the `Content-Transfer-Encoding` header for this file. */
    encoding: string

    /** Value of the `Content-Type` header for this file. */
    mimetype: string

    /** Size of the file in bytes. */
    size: number

    /** `DiskStorage` Directory to which this file has been uploaded. */
    destination: string

    /** `DiskStorage` Name of this file within `destination` (on server system, without extension) */
    filename: string

    /** `DiskStorage` Full path to the uploaded file (on server system, without extension) */
    path: string

    /** `MemoryStorage` A Buffer containing the entire file. */
    buffer: Buffer
}

declare namespace Express {
    interface Request {
        user: Record<string, unknown> & { _id: string }
        file?: Partial<UploadFileType>
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
