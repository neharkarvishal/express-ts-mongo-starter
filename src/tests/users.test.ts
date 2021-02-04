import express from 'express'
import mongoose from 'mongoose'
import request from 'supertest'

import App from '../app'
import UsersModule from '../modules/users'

afterAll(async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500))
})

describe('Testing Users', () => {
    describe('GET /users', () => {
        it('response All Users', () => {
            const usersController = UsersModule

            usersController.service.model.find = jest.fn().mockReturnValue(
                Promise.resolve([
                    {
                        email: 'example@gmail.com',
                        password: 'q1w2e3r4!',
                    },
                ]),
            )

            mongoose.connect = jest.fn()
            const app = App.of(express()).with([usersController])

            return request(app.getExpressApp())
                .get(`${usersController.path}`)
                .expect(200)
        })
    })
})
