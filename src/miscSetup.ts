import 'source-map-support/register'

process.on('uncaughtExceptionMonitor', (err: unknown, origin: unknown) => {
    console.log(
        '[process.on.uncaughtExceptionMonitor]\nUnhandled Exception at:',
        err,
        '\n**Origin:',
        origin,
    )
    // Application specific logging, throwing an error, or other logic here
})

process.on('uncaughtException', (err: unknown, origin: unknown) => {
    console.log(
        '[process.on.uncaughtException]\nUnhandled Exception at:',
        err,
        '\n**Origin:',
        origin,
    )
})

process.on('unhandledRejection', (reason, promise) => {
    console.log(
        '[process.on.unhandledRejection]\nUnhandled Rejection at:',
        promise,
        '\n**Reason:',
        reason,
    )
    // Application specific logging, throwing an error, or other logic here
})

process.on('warning', (warning) => {
    console.warn(
        '[process.on.warning]\nWarning:',
        warning.name,
        '\n**Message:',
        warning.message,
        '\n**Stack:',
        warning.stack,
    )
})

process.on('multipleResolves', (type, promise, reason) => {
    console.warn(
        '[process.on.multipleResolves]\nResolves Type:',
        type,
        '\n**Promise:',
        promise,
        '\n**Reason:',
        reason,
    )
})
