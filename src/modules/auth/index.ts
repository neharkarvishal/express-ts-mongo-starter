import UserModel from '../users/users.model'
import AuthController from './auth.controller'
import AuthService from './auth.service'

export default AuthController.create(AuthService.create(UserModel))
