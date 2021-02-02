import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import { connect, set } from 'mongoose'
import morgan from 'morgan'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import { dbConnection } from './database'
import Routes from './interfaces/module.interface'
import errorMiddleware from './middlewares/error.middleware'
import { logger, stream } from './utils/logger'

require('express-async-errors')

class App {
    public app: express.Application

    public port: string | number

    public env: string

    constructor(routes: Routes[]) {
        this.app = express()
        this.port = process.env.PORT || 3000
        this.env = process.env.NODE_ENV || 'development'

        this.connectToDatabase()
        this.initializeMiddlewares()
        this.initializeRoutes(routes)
        this.initializeSwagger()
        this.initializeErrorHandling()
    }

    static of(routes: Routes[]) {
        return new App(routes)
    }

    public listen() {
        this.app.listen(this.port, () => {
            logger.info(`🚀 App listening on the port ${this.port}`)
        })
    }

    public getServer() {
        return this.app
    }

    private connectToDatabase() {
        if (this.env !== 'production') {
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
        if (this.env === 'production') {
            this.app.use(morgan('combined', { stream }))
            this.app.use(cors({ origin: 'your.domain.com', credentials: true }))
        } else if (this.env === 'development') {
            this.app.use(morgan('dev', { stream }))
            this.app.use(cors({ origin: true, credentials: true }))
        }

        this.app.use(compression())
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cookieParser())
        this.app.use(hpp())
        this.app.use(helmet())
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach((route) => {
            this.app.use('/', route.router)
        })
    }

    private initializeSwagger() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'REST API',
                    version: '1.0.0',
                    description: 'Example docs',
                },
            },
            apis: ['swagger.yaml'],
        }

        const specs = swaggerJSDoc(options)
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware)
    }
}

export default App
