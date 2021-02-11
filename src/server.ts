import './config/env'

import * as http from 'http'

import app from './app'
import dbPromise from './config/database'
import ApiException, { NotFound } from './exceptions/ApiException'
import routes from './routes'
import { logger } from './utils/logger'

Promise.all([dbPromise('app')])
    .then((dependencies) => {
        const [db] = dependencies

        /** init routes */
        app.use(routes({ db }))

        /** 404'd paths -> forward to error handler */
        app.use((req, res, next) => {
            next(NotFound())
        })

        /** Error handler */
        app.use((e, req, res, next) => {
            if (e instanceof ApiException) {
                res.status(e.status).json({
                    message: e.message,
                    status: e.status,
                    errors:
                        e.errors && Object.keys(e.errors).length
                            ? e.errors
                            : undefined,
                })
                return
            }

            logger.error(`${e.message}\n${e.stack}`) // eslint-disable-line @typescript-eslint/restrict-template-expressions

            const response: Record<string, unknown> = {
                status: 500,
                errors: {},
            }

            // only providing error in development
            if (process.env.NODE_ENV === 'development') {
                response.message = e.message
                response.stack = e.stack
            } else if (
                // Check error related for request body, (bodyparsererrors)
                [
                    'encoding.unsupported',
                    'request.aborted',
                    'entity.too.large',
                    'request.size.invalid',
                    'stream.encoding.set',
                    'parameters.too.many',
                    'charset.unsupported',
                    'encoding.unsupported',
                    'entity.verify.failed',
                    'entity.parse.failed',
                ].indexOf(e.type) !== -1
            ) {
                response.message = 'Something wrong in request'
            } else {
                response.message = 'Something went wrong'
            }

            res.status(500).json(response)
        })

        /** Create HTTP server */
        const server = http.createServer(app)
        const port = process.env.PORT || 3000

        server.listen(port)
        server.on('error', (error) => {
            // @ts-ignore
            if (error?.syscall !== 'listen') {
                throw error
            }

            const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

            // @ts-ignore, handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    logger.error(`${bind} requires elevated privileges`)
                    process.exit(1)
                    break
                case 'EADDRINUSE':
                    logger.error(`${bind} is already in use`)
                    process.exit(1)
                    break
                default:
                    throw error
            }
        })

        server.on('listening', () => {
            const addr = server.address()
            const bind =
                typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}` // eslint-disable-line @typescript-eslint/restrict-template-expressions

            logger.info(`Listening on ${bind}`, { tags: ['APP BOOTSTRAP'] })
        })

        return dependencies
    })
    .catch((e) => logger.error(e, { tags: ['APP BOOTSTRAP'] }))
