import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Router } from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import { connect, set } from 'mongoose'
import morgan from 'morgan'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import { dbConnection } from './database'
import HttpException from './exceptions/HttpException'
import Module from './interfaces/module.interface'
import errorMiddleware from './middlewares/error.middleware'
import { logger, stream } from './utils/logger'

class App {
    constructor(readonly app: express.Application) {
        this.connectToDatabase()
        this.initializeMiddlewares()
        this.initializeSwagger()
    }

    static of(app: express.Application) {
        return new App(app)
    }

    with(modules: Module[]) {
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

    private connectToDatabase() {
        if (process.env.NODE_ENV !== 'production') {
            set('debug', true)
        }

        connect(dbConnection.url, dbConnection.options)
            .then(() => {
                logger.info('🟢 The database is connected.')
            })
            .catch((error: Error) => {
                logger.error(
                    `🔴 Unable to connect to the database: ${JSON.stringify(
                        error,
                    )}.`,
                )
            })
    }

    private initializeMiddlewares() {
        if (process.env.NODE_ENV === 'production') {
            this.app.use(morgan('combined', { stream }))
            this.app.use(cors({ origin: 'your.domain.com', credentials: true }))
        } else if (process.env.NODE_ENV === 'development') {
            this.app.use(morgan('dev', { stream }))
            this.app.use(cors({ origin: true, credentials: true }))
        }

        // this.app.use(compression())
        this.app.use(cookieParser())
        this.app.use(hpp())
        this.app.use(helmet())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: false }))
    }

    private initializeRouter(modules: Module[]) {
        modules.forEach((module) => {
            this.app.use('/', module.router)
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
