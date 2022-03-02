import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { ValidationMiddleware } from '../middlewares/validation.middleware'
import { authSignupVS } from '../validation/auth.validation'

export const AuthRouter = Router()

const authController = new AuthController()

AuthRouter.post('/login', authController.login)

AuthRouter.post(
	'/signup',
	ValidationMiddleware(authSignupVS),
	authController.signup
)
