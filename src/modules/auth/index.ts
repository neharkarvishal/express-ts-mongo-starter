import UserModel from '../users/users.model'
import UserService from '../users/users.service'
import AuthController from './auth.controller'
import AuthService from './auth.service'

export default AuthController.create({
    authService: AuthService.create(UserModel),
    userService: UserService.create(UserModel),
})
