import UserModel from '../users/users.model'
import AuthController from './auth.controller'
import AuthModule from './auth.module'
import AuthService from './auth.service'

export default AuthModule.create(
    AuthController.create(AuthService.create(UserModel)),
)
