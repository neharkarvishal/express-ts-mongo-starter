import express from 'express'
import request from 'supertest'

import App from '../app'
import HomeController from '../modules/home/home.controller'

afterAll(async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500))
})

describe('Testing Index', () => {
    describe('[GET] /', () => {
        it('response statusCode 200', () => {
            const homeRoute = HomeController.create()
            const app = App.of(express()).with([homeRoute])

            return request(app.getExpressApp()).get(`${homeRoute.path}`).expect(200)
        })
    })
})
