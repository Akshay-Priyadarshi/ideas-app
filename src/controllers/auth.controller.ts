import { NextFunction, Request, Response } from 'express'
import { JwtPayload, sign } from 'jsonwebtoken'
import { AuthService } from '../services/auth.service'
import { MailService } from '../services/mail.service'
import { AppResponse } from '../responses/app.response'
import { AppSuccessResponse } from '../responses/success.response'
import { getEnv } from '../utils/env.util'
import { getUserVerifyRedirectUrl } from '../utils/url.util'
import { ENV_ACCESS_TOKEN_SECRET } from '../utils/constant.util'

export class AuthController {
	constructor(
		private authService = new AuthService(),
		private mailService = new MailService()
	) {}

	login = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const loginResponse = await this.authService.login(req.body)
			const appResponse = new AppResponse({
				reqPath: req.originalUrl,
				success: new AppSuccessResponse({
					message: 'you have successfully logged in',
					data: loginResponse,
				}),
			})
			res.json(appResponse)
		} catch (err) {
			next(err)
		}
	}

	signup = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const signedupUser = await this.authService.signup(req.body)
			if (signedupUser) {
				const signedVerifyToken = sign(
					{ sub: signedupUser.id } as JwtPayload,
					getEnv(ENV_ACCESS_TOKEN_SECRET) as string
				)
				await this.mailService.sendVerifyUserMail(
					signedupUser.id,
					getUserVerifyRedirectUrl(req, signedVerifyToken)
				)
				const appResponse = new AppResponse({
					reqPath: req.originalUrl,
					success: new AppSuccessResponse({
						message: 'you have successfully signed up',
						data: signedupUser,
					}),
				})
				res.json(appResponse)
			}
		} catch (err) {
			next(err)
		}
	}
}
