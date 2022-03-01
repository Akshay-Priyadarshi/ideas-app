import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import {
	ValidationApplyMiddleware,
	ValidationResultMiddleware,
} from '../middlewares/validation.middleware'
import { authSignupVS } from '../validation/auth.validation'

export const AuthRouter = Router()

const authController = new AuthController()

AuthRouter.post('/login', authController.login)

AuthRouter.post(
	'/signup',
	ValidationApplyMiddleware(authSignupVS),
	ValidationResultMiddleware(),
	authController.signup
)
