import { Router } from 'express'
import { body, param } from 'express-validator'
import { UserController } from '../controllers/user.controller'
import {
	AuthenticationMiddleware,
	SelfAndAdminAuthorizationMiddleware,
} from '../middlewares/auth.middleware'

export const UserRouter = Router()

const userController = new UserController()

UserRouter.get('/count', userController.getCount)

UserRouter.get('/', userController.getAllUsers)

UserRouter.get(
	'/:userId',
	param('userId').isMongoId().withMessage('user id is not valid'),
	userController.getUserById
)

UserRouter.put(
	'/:userId',
	param('userId').isMongoId().withMessage('user id is not valid'),
	body('email').optional().isEmail().withMessage('email is invalid'),
	AuthenticationMiddleware(),
	SelfAndAdminAuthorizationMiddleware(),
	userController.updateUser
)

UserRouter.delete(
	'/:userId',
	param('userId').isMongoId().withMessage('user id is not valid'),
	AuthenticationMiddleware(),
	SelfAndAdminAuthorizationMiddleware(),
	userController.deleteUser
)

UserRouter.put(
	'/reset-password/:userId',
	param('userId').isMongoId().withMessage('user id is not valid'),
	AuthenticationMiddleware(),
	SelfAndAdminAuthorizationMiddleware(),
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
