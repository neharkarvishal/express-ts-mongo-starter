/* eslint-disable @typescript-eslint/restrict-template-expressions,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-floating-promises */
import Redis from 'ioredis'
import { v4 as uuidv4 } from 'uuid'

import { logger } from '../utils/logger'

const logTags = { tags: ['FRONTEND', 'REDIS'] }

const {
    REDIS_HOST,
    REDIS_PORT,
    REDIS_PASSWORD,
    REDIS_DB,
    REDIS_PREFIX,
} = process.env

export const redisOptions = {
    host: String(REDIS_HOST) ?? '127.0.0.1',
    port: Number(REDIS_PORT) ?? 6379,
    password: REDIS_PASSWORD ?? undefined,
    db: Number(REDIS_DB) ?? 0,
    keyPrefix: REDIS_PREFIX ?? 'api:',
}

/*
export const redisClient = new Redis(redisOptions)

redisClient
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
        logger.info(`Subscribed channel ${channel} count #${count}`, logTags)
    })
    .on('unsubscribe', (channel, count) => {
        logger.info(`Unsubscribed channel ${channel}, ${count}`, logTags)
    })

// @ts-ignore
redisClient.remember = async (key, expiry, callback = async () => {}) => {
    // first check value in cache
    try {
        const data = await redisClient.get(key)
        if (data) {
            logger.debug(`CACHE HIT ${key}`, logTags)
            return JSON.parse(data)
        }
    } catch (e) {
        logger.error(e)
    }

    // value not exists in cache, call callback function to set value in cache
    logger.info(`CACHE MISS ${key}`, logTags)
    const data = await callback()

    /!**
     * Set data into cache when
     * -> it is not undefined
     * -> it is null (because some query can return null as a result)
     * -> there is no error flag set on data
     *!/
    // @ts-ignore
    if (data !== undefined && (data === null || !data?.error)) {
        // set cache only when we get some value
        redisClient.setex(key, expiry, JSON.stringify(data))
    }
    return data
}

// @ts-ignore
redisClient.put = (key, tagsCsv = '', cacheTTL, data) => {
    const tags = tagsCsv
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)

    if (tags.length) {
        // cache data with tag
        const multi = redisClient.multi()

        multi.setex(key, cacheTTL, JSON.stringify(data))

        tags.forEach((tag) => {
            multi.sadd(`tag:${tag}`, key)
        })

        multi.exec((err) => {
            if (err) {
                logger.error(`${err.message}\n${err.stack}`, logTags)
            }
        })
    } else {
        // cache data without tag
        redisClient.setex(key, cacheTTL, JSON.stringify(data), (err) => {
            if (err) {
                logger.error(`${err.message}\n${err.stack}`, logTags)
            }
        })
    }
}

const deleteSetMembersCache = (setKeys) =>
    setKeys.map(
        (setKey) =>
            new Promise((res) => {
                // get all keys associated with tag
                redisClient.scard(setKey, (errScard, totalMembers) => {
                    let deletedMembers = 0

                    if (!totalMembers) {
                        res(true)
                        return
                    }

                    const stream = redisClient.sscanStream(setKey, {
                        count: 50,
                    })

                    stream.on('data', (cacheKeys) => {
                        stream.pause()

                        if (!cacheKeys.length) {
                            setTimeout(() => stream.resume())
                            return
                        }

                        redisClient.del(cacheKeys, (errDel) => {
                            if (errDel) {
                                logger.error(
                                    `${errDel.message}\n${errDel.stack}`,
                                    logTags,
                                )
                            }

                            redisClient.srem(setKey, cacheKeys, (errSrem) => {
                                if (errSrem) {
                                    logger.error(
                                        `${errSrem.message}\n${errSrem.stack}`,
                                        logTags,
                                    )
                                }

                                deletedMembers += cacheKeys.length
                                setTimeout(() => stream.resume())
                            })
                        })
                    })

                    stream.on('end', () => {
                        setTimeout(() => {
                            res(totalMembers - deletedMembers)
                        }, 5000)
                    })
                })
            }),
    )

// @ts-ignore
redisClient.purge = (tagsCsv = '') => {
    const tags = tagsCsv
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)

    if (tags.length) {
        const multi = redisClient.multi()

        const renamedTagKeys = tags.map((tag) => {
            const oldKey = `tag:${tag}`
            const newKey = `tag:temp:${tag}-${uuidv4()}`
            multi.rename(oldKey, newKey) // rename tag to a temp key
            multi.expire(newKey, 600) // expire temp set in 10 minutes
            return newKey
        })

        multi.exec((err) => {
            if (err) {
                logger.error(`${err.message}\n${err.stack}`, logTags)
            }
        })

        Promise.all(deleteSetMembersCache(renamedTagKeys)).finally(() => {
            // call it again to revisit any missing keys in scan
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            Promise.all(deleteSetMembersCache(renamedTagKeys))
        })
    }
}
*/
