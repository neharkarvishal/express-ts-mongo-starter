import 'dotenv/config'
import './miscSetup'

import { cleanEnv, port, str, num, host } from 'envalid'

require('express-async-errors')

const validateEnv = () => {
    cleanEnv(process.env, {
        NODE_ENV: str(),
        DOMAIN: str(),
        PORT: port(),
        MONGO_HOST: str(),
        MONGO_PORT: str(),
        MONGO_DATABASE: str(),
        JWT_SECRET: str(),

        REDIS_HOST: host(),
        REDIS_PORT: port(),
        REDIS_PASSWORD: str(),
        REDIS_DB: num(),
        REDIS_PREFIX: str(),
    })
}

validateEnv()
