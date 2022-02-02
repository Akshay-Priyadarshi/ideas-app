import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'

export const AuthRouter = Router()

const authController = new AuthController()

AuthRouter.post('/login', authController.login)

AuthRouter.post('/signup', authController.signup)
