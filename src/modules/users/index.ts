import UsersController from './users.controller'
import UserModel from './users.model'
import UserService from './users.service'

export default UsersController.create({
    userService: UserService.create(UserModel),
})
