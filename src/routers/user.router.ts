import { Router } from 'express'
import { body, param } from 'express-validator'
import { UserController } from '../controllers/user.controller'
import {
	AuthenticationMiddleware,
	SelfAuthorizationMiddleware,
} from '../middlewares/auth.middleware'

export const UserRouter = Router()

const userController = new UserController()

UserRouter.get('/', userController.getAllUsers)

UserRouter.get(
	'/:userId',
	param('userId').isMongoId().withMessage('user id is not valid'),
	userController.getUserById
)

UserRouter.put(
	'/:userId',
	param('userId').isMongoId().withMessage('user id is not valid'),
	body('email').exists().isEmail().withMessage('email is invalid'),
	AuthenticationMiddleware(),
	SelfAuthorizationMiddleware(),
	userController.updateUser
)

UserRouter.delete(
	'/:userId',
	param('userId').isMongoId().withMessage('user id is not valid'),
	AuthenticationMiddleware(),
	SelfAuthorizationMiddleware(),
	userController.deleteUser
)

UserRouter.put(
	'/reset-password/:userId',
	param('userId').isMongoId().withMessage('user id is not valid'),
	AuthenticationMiddleware(),
	SelfAuthorizationMiddleware(),
	userController.resetUserPassword
)

UserRouter.get(
	'/verify-user/:userId',
	param('userId').isMongoId().withMessage('user id is not valid'),
	userController.verifyUser
)

UserRouter.get(
	'/verify-user-redirect/:verifyToken',
	param('verifyToken').not().isJWT().withMessage('invalid jwt'),
	userController.verifyUserRedirect
)
