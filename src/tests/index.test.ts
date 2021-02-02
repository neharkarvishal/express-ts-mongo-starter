import request from 'supertest'

import App from '../app'
import IndexModule from '../modules/home/home.module'

afterAll(async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500))
})

describe('Testing Index', () => {
    describe('[GET] /', () => {
        it('response statusCode 200', () => {
            const indexRoute = IndexModule.create()
            const app = App.of([indexRoute])

            return request(app.getServer()).get(`${indexRoute.path}`).expect(200)
        })
    })
})
