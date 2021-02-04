const { MONGO_HOST, MONGO_PORT, MONGO_DATABASE } = process.env

export const dbConnection = {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    url: `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    },
}
