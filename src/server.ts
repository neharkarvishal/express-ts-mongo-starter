/* eslint-disable @typescript-eslint/no-floating-promises */
import './config/env'

import express from 'express'
import * as http from 'http'

import App from './app'
import dbPromise from './config/database'
import AuthModule from './modules/auth'
import HomeModule from './modules/home'
import UsersModule from './modules/users'
import { logger } from './utils/logger'

Promise.all([dbPromise('app')]).then(([db]) => {
    const expressInstance = express()

    /** initialize your `app` with routes from Modules */
    const appModule = App.of(expressInstance).with([
        HomeModule,
        UsersModule,
        AuthModule,
    ])

    /**
     * Create HTTP server
     */
    const server = http.createServer(expressInstance)
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

        logger.info(`Listening on ${bind}`)
    })
})
