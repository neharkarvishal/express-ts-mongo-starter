import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import Redis from 'ioredis'
import { connect, set } from 'mongoose'
import morgan from 'morgan'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import { redisOptions } from './config/cache'
import { dbConnection } from './config/database'
import HttpException from './exceptions/HttpException'
import Controller from './interfaces/controller.interface'
import errorMiddleware from './middlewares/error.middleware'
import { logger, stream } from './utils/logger'

function successResponder(
    this,
    options: {
        data: Record<any, any> | Array<any>
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

class App {
    redisClient

    constructor(readonly app: express.Application) {
        // this.connectToDatabase()
        // this.connectToRedis()
        this.initializeMiddlewares()
        this.initializeSwagger()
    }

    static of(app: express.Application) {
        return new App(app)
    }

    with(modules: Controller[]) {
        this.initializeRouter(modules)
        this.initializeErrorHandling()
        return this
    }

    public listen(listeningListener?: () => void) {
        this.app.listen(process.env.PORT ?? 3000, () => {
            logger.info(`Listening on the port ${process.env.PORT ?? 3000}`)
            if (listeningListener) listeningListener()
        })
    }

    public getExpressApp(): express.Application {
        return this.app
    }

    private connectToRedis() {
        const logTags = { tags: ['MONGO_STATUS'] }

        this.redisClient = new Redis(redisOptions)

        if (this.redisClient)
            this.redisClient
                .on('connect', () => {
                    logger.info('redis connection established', logTags)
                })
                .on('error', (error) => {
                    logger.error('redis error', error, logTags)
                })
                .on('close', () => {
                    logger.info('redis connection closed', logTags)
                })
                .on('reconnecting', () => {
                    logger.info('redis reconnecting...', logTags)
                })
                .on('end', () => {
                    logger.info('redis connection end', logTags)
                })
                .on('subscribe', (channel, count) => {
                    logger.info(
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        `Subscribed channel ${channel} count #${count}`,
                        logTags,
                    )
                })
                .on('unsubscribe', (channel, count) => {
                    logger.info(
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        `Unsubscribed channel ${channel}, ${count}`,
                        logTags,
                    )
                })
        else logger.error(`Unable to connect to redis.`)
    }

    private connectToDatabase() {
        if (process.env.NODE_ENV !== 'production') {
            set('debug', true)
        }

        const TAGS = ['MONGO_STATUS']

        connect(dbConnection.url, dbConnection.options)
            .then((m) => {
                m.connection.on('error', (err) => {
                    logger.error(err, { tags: TAGS })
                })

                m.connection.on('reconnected', () => {
                    logger.info('mongodb reconnected', { tags: TAGS })
                })

                m.connection.on('disconnected', () => {
                    logger.warn('mongodb disconnected', { tags: TAGS })
                })

                m.connection.once('open', () => {
                    logger.info('mongodb connection established', { tags: TAGS })
                })

                logger.info('The database is connected.')
            })
            .catch((error: Error) => {
                logger.error(
                    `Unable to connect to the database: ${JSON.stringify(error)}.`,
                    { tags: TAGS },
                )
            })
    }

    private initializeMiddlewares() {
        if (process.env.NODE_ENV === 'production') {
            this.app.use(morgan('combined', { stream }))
            this.app.use(cors({ origin: process.env.DOMAIN, credentials: true }))
        } else {
            this.app.use(morgan('dev', { stream }))
            this.app.use(cors({ origin: true, credentials: true }))
        }

        // this.app.use(compression())
        this.app.use(cookieParser())
        this.app.use(hpp())
        this.app.use(helmet())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: false }))

        this.app.set('x-powered-by', false)
        this.app.set('trust proxy', 1)

        this.app.use((req, res, next) => {
            // @ts-ignore
            res.done = successResponder.bind(res)
            next()
        })
    }

    private initializeRouter(modules: Controller[]) {
        modules.forEach((module) => {
            this.app.use('/', module.getRouter())
        })
    }

    private initializeSwagger() {
        const specs = swaggerJSDoc({
            swaggerDefinition: {
                info: {
                    title: 'REST API',
                    version: '1.0.0',
                    description: 'Example docs',
                },
            },
            apis: ['swagger.yaml'],
        })

        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
    }

    private initializeErrorHandling() {
        // catch 404 and forward to error handler
        this.app.use((req, res, next) => {
            next(new HttpException({ message: 'Not Found', status: 404 }))
        })

        this.app.use(errorMiddleware)
    }
}

export default App
