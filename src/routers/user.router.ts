import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import {
	AuthenticationMiddleware,
	SelfAuthorizationMiddleware,
} from '../middlewares/auth.middleware'

export const UserRouter = Router()

const userController = new UserController()

UserRouter.get('/', userController.getAllUsers)

UserRouter.get('/:userId', userController.getUserById)

UserRouter.put(
	'/:userId',
	AuthenticationMiddleware(),
	SelfAuthorizationMiddleware(),
	userController.updateUser
)

UserRouter.delete(
	'/:userId',
	AuthenticationMiddleware(),
	SelfAuthorizationMiddleware(),
	userController.deleteUser
)

UserRouter.put(
	'/reset-password/:userId',
	AuthenticationMiddleware(),
	SelfAuthorizationMiddleware(),
	userController.resetUserPassword
)

UserRouter.get('/verify-user/:userId', userController.verifyUser)

UserRouter.get(
	'/verify-user-redirect/:verifyToken',
	userController.verifyUserRedirect
)
