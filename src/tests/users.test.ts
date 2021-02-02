import mongoose from 'mongoose'
import request from 'supertest'

import App from '../app'
import UsersModule from '../modules/users/users.module'

afterAll(async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500))
})

describe('Testing Users', () => {
    describe('GET /users', () => {
        it('response All Users', () => {
            const usersRoute = UsersModule.create()

            usersRoute.usersController.userService.users.find = jest
                .fn()
                .mockReturnValue(
                    Promise.resolve([
                        {
                            email: 'example@gmail.com',
                            password: 'q1w2e3r4!',
                        },
                    ]),
                )

            mongoose.connect = jest.fn()
            const app = App.of([usersRoute])

            return request(app.getServer()).get(`${usersRoute.path}`).expect(200)
        })
    })
})
