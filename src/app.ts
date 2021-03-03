import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import helmet from 'helmet'
import hpp from 'hpp'
import morgan from 'morgan'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import { stream } from './utils/logger'

/** Response helper */
function successResponder(
    this,
    options: {
        data: Record<any, any> | Array<any> | any
        paging?: Record<string, unknown>
        code?: number
        message?: string
        status?: 'success' | 'error'
    },
): void {
    const { data, message = 'OK', code = 200, paging, status = 'success' } = options

    // `this` refers to the bonded `res` object
    this.status(code).json({
        data,
        status,
        paging,
        message,
    })
}

/** initialize your `app` with routes from Modules */
const app = express()

/** Setting up loggers and middlewares */
app.use(
    morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream }),
    express.json(),
    express.urlencoded({ extended: false }),
    cors(),
    cookieParser(),
    hpp(),
    helmet(),
    mongoSanitize({ replaceWith: '_' }),
)

/** Setting up express configs */
app.set('x-powered-by', false)
app.set('trust proxy', 1)

/** Binding response helper to `res` object to end the request */
app.use((req, res, next) => {
    res.done = successResponder.bind(res)
    next()
})

/** Setting up swagger docs */
app.use(
    '/docs/file',
    swaggerUi.serve,
    swaggerUi.setup(
        swaggerJSDoc({
            swaggerDefinition: {
                info: {
                    title: 'REST API',
                    version: '1.0.0',
                    description: 'Example docs',
                },
            },
            apis: ['swagger.yaml'],
        }),
    ),
)

export default app
