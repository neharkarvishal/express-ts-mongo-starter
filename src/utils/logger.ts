import fs from 'fs'
import winston from 'winston'
import winstonDaily from 'winston-daily-rotate-file'

/** Requiring `winston-mongodb` will expose `winston.transports.MongoDB` */
import 'winston-mongodb'

// logs dir
const logDir = `${__dirname}/../logs`

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}

/** Log Level -> error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 */

// winston formats:
const {
    cli,
    printf,
    simple,
    combine,
    metadata,
    colorize,
    timestamp,
} = winston.format

// Define log format
const logFormatter = printf(
    ({ timestamp: ts, level, message, meta }) => `${ts} ${level}: ${message}`, // eslint-disable-line @typescript-eslint/restrict-template-expressions
)

const logger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        // logFormatter,
        metadata(),
    ),
    transports: [],
})

if (process.env.NODE_ENV !== 'production')
    logger.add(
        new winston.transports.Console({
            format: combine(cli(), colorize(), simple()),
        }),
    )

const addMongoWinstonTransport = (options) =>
    logger.add(new winston.transports.MongoDB(options))

/** Morgan stream for HTTP Logger */
const stream = {
    write: (message: string) => {
        logger.info(message.substring(0, message.lastIndexOf('\n')))
    },
}

export { logger, stream, addMongoWinstonTransport }
