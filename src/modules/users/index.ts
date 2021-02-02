import UsersController from './users.controller'
import UserModel from './users.model'
import UsersModule from './users.module'
import UserService from './users.service'

export default UsersModule.create(
    UsersController.create(UserService.create(UserModel)),
)
