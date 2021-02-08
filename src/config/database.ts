import mongoose, { ConnectionOptions } from 'mongoose'

import { logger } from '../utils/logger'

const { MONGO_HOST, MONGO_PORT, MONGO_DATABASE } = process.env

export const dbConnection: {
    url: string
    options: ConnectionOptions
} = {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    url: `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`,
    options: {
        poolSize: 10,
        keepAlive: true, // 300000
        connectTimeoutMS: 30000,
        autoIndex: true,
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        user: undefined,
        pass: undefined,
    },
}

if (process.env.NODE_ENV !== 'production' || Boolean(process.env.DB_DEBUG)) {
    mongoose.set('debug', true)
}

export default async (type = 'app') => {
    const TAGS = ['MONGO_STATUS', type.toUpperCase()]

    // Refer: https://stackoverflow.com/questions/22786374/queries-hang-when-using-mongoose-createconnection-vs-mongoose-connect
    try {
        /*
        const connection = mongoose.createConnection(dbConnection.url, {
            poolSize: 10,
            keepAlive: true, // 300000
            connectTimeoutMS: 30000,
            autoIndex: true,
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            user: undefined,
            pass: undefined,
        })

        connection.on('error', (err) => {
            logger.error(err, { tags: TAGS })
        })

        connection.on('reconnected', () => {
            logger.info('[DB] mongodb reconnected', { tags: TAGS })
        })

        connection.on('disconnected', () => {
            logger.warn('[DB] mongodb disconnected', { tags: TAGS })
        })

        connection.once('open', () => {
            logger.info('[DB] mongodb connection established', { tags: TAGS })
        })
        return connection
        */

        return await mongoose
            .connect(dbConnection.url, dbConnection.options)
            .then((m) => {
                m.connection.on('error', (err) => {
                    logger.error(err, { tags: TAGS })
                })

                m.connection.on('reconnected', () => {
                    logger.info('[DB] mongodb reconnected', { tags: TAGS })
                })

                m.connection.on('disconnected', () => {
                    logger.warn('[DB] mongodb disconnected', { tags: TAGS })
                })

                m.connection.once('open', () => {
                    logger.info('[DB] mongodb connection established', {
                        tags: TAGS,
                    })
                })

                logger.info('[DB] mongodb connection, database is connected', {
                    tags: TAGS,
                })
                return m
            })
            .catch((e) => logger.error(e, { tags: TAGS }))
    } catch (e) {
        logger.error(e, { tags: TAGS })
        return Promise.reject(e)
    }
}
