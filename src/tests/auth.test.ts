import bcrypt from 'bcrypt'
import express from 'express'
import mongoose from 'mongoose'
import request from 'supertest'

import App from '../app'
import ApiException from '../exceptions/ApiException'
import AuthModule from '../modules/auth'
import { TokenData } from '../modules/auth/auth.interface'
import AuthService from '../modules/auth/auth.service'
import { CreateUserDto } from '../modules/users/users.dto'
import UserModel from '../modules/users/users.model'

afterAll(async () => {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500))
})

describe('Testing AuthController', () => {
    describe('POST /signup', () => {
        it('response should have the Create userData', () => {
            const userData: CreateUserDto = {
                email: 'test@email.com',
                password: 'q1w2e3r4!',
            }

            const authController = AuthModule

            authController.authService.model.findOne = jest
                .fn()
                .mockReturnValue(Promise.resolve(undefined))

            authController.authService.model.create = jest
                .fn()
                .mockReturnValue({ _id: 0, ...userData })

            mongoose.connect = jest.fn()
            const app = App.of(express()).with([authController])

            return request(app.getExpressApp()).post('/signup').send(userData)
        })
    })

    describe('POST /login', () => {
        it('response should have the Set-Cookie header with the Authorization token', async () => {
            const userData: CreateUserDto = {
                email: 'test@email.com',
                password: 'q1w2e3r4!',
            }
            process.env.JWT_SECRET = 'jwt_secret'

            const authController = AuthModule

            authController.authService.model.findOne = jest.fn().mockReturnValue(
                Promise.resolve({
                    _id: 0,
                    email: 'test@email.com',
                    password: await bcrypt.hash(userData.password, 10),
                }),
            )

            mongoose.connect = jest.fn()
            const app = App.of(express()).with([authController])

            return request(app.getExpressApp())
                .post('/login')
                .send(userData)
                .expect('Set-Cookie', /^Authorization=.+/)
        })
    })

    describe('POST /logout', () => {
        it('logout Set-Cookie Authorization=; Max-age=0', () => {
            const authController = AuthModule

            const app = App.of(express()).with([authController])

            return request(app.getExpressApp())
                .post('/logout')
                .expect('Set-Cookie', /^Authorization=;/)
        })
    })
})

describe('Testing AuthService', () => {
    describe('when creating a cookie', () => {
        it('should return a string', () => {
            const tokenData: TokenData = {
                token: '',
                expiresIn: 1,
            }
            const authService = AuthService.create(UserModel)

            expect(typeof authService.createCookie(tokenData)).toEqual('string')
        })
    })
})
