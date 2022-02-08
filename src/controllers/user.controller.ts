import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { MailService } from '../services/mail.service'
import { UserService } from '../services/user.service'
import { AppResponse } from '../responses/app.response'
import { AppErrorResponse } from '../responses/error.response'
import { AppSuccessResponse } from '../responses/success.response'
import { getUserVerifyRedirectUrl } from '../utils/url.util'
import { getClientErrors } from '../utils/error.util'
import { ENV_VERIFY_USER_SECRET } from '../utils/constant.util'
import { getSignedJwtToken } from '../utils/jwt.util'
import { getPaginationDataFromQuery } from '../utils/transform.util'

export class UserController {
	constructor(
		private userService = new UserService(),
		private mailService = new MailService()
	) {}

	getUserCount = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const count = await this.userService.getUserCount()
			const appResponse = new AppResponse({
				reqPath: req.originalUrl,
				success: new AppSuccessResponse({
					data: count,
				}),
			})
			res.json(appResponse)
		} catch (err) {
			next(err)
		}
	}

	getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const users = await this.userService.getAllUsers(
				getPaginationDataFromQuery(req.query)
			)
			const appResponse = new AppResponse({
				reqPath: req.originalUrl,
				success: new AppSuccessResponse({ data: users }),
			})
			res.json(appResponse)
		} catch (err) {
			next(err)
		}
	}

	getUserById = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const clientErrors = getClientErrors(req)
			if (clientErrors != null) {
				throw clientErrors
			}
			const user = await this.userService.getUserById(req.params.userId)
			const appResponse = new AppResponse({
				reqPath: req.originalUrl,
				success: new AppSuccessResponse({ data: user }),
			})
			res.json(appResponse)
		} catch (err) {
			next(err)
		}
	}

	updateUser = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const clientErrors = getClientErrors(req)
			if (clientErrors != null) {
				throw clientErrors
			}
			const updatedUser = await this.userService.updateUser(
				req.params.userId,
				req.body
			)
			const appResponse = new AppResponse({
				reqPath: req.originalUrl,
				success: new AppSuccessResponse({
					data: updatedUser,
					message: 'user account is modified successfully',
				}),
			})
			res.json(appResponse)
		} catch (err) {
			next(err)
		}
	}

	deleteUser = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const clientErrors = getClientErrors(req)
			if (clientErrors != null) {
				throw clientErrors
			}
			const deletedUser = await this.userService.deleteUser(req.params.userId)
			const appResponse = new AppResponse({
				reqPath: req.originalUrl,
				success: new AppSuccessResponse({
					data: deletedUser,
					message: 'user account is deleted successfully',
				}),
			})
			res.json(appResponse)
		} catch (err) {
			next(err)
		}
	}

	resetUserPassword = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const clientErrors = getClientErrors(req)
			if (clientErrors != null) {
				throw clientErrors
			}
			const resetResult = await this.userService.resetUserPassword(
				req.params.userId,
				req.body
			)
			if (resetResult) {
				res.json(
					new AppResponse({
						reqPath: req.originalUrl,
						success: new AppSuccessResponse({
							message: 'new password successfully saved',
						}),
					})
				)
			}
		} catch (err) {
			next(err)
		}
	}

	verifyUser = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const clientErrors = getClientErrors(req)
			if (clientErrors != null) {
				throw clientErrors
			}
			const payload = { sub: req.params.userId }
			const signedVerifyToken = getSignedJwtToken(
				payload,
				ENV_VERIFY_USER_SECRET
			)
			await this.mailService.sendVerifyUserMail(
				req.params.userId,
				getUserVerifyRedirectUrl(req, signedVerifyToken)
			)
			const appResponse = new AppResponse({
				reqPath: req.originalUrl,
				success: new AppSuccessResponse({
					message: 'verification mail sent successfully',
				}),
			})
			res.json(appResponse)
		} catch (err) {
			next(err)
		}
	}

	verifyUserRedirect = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const clientErrors = getClientErrors(req)
			if (clientErrors != null) {
				console.log(clientErrors)
				throw clientErrors
			}
			const ifVerified = await this.userService.verifyUserRedirect(
				req.params.verifyToken
			)
			if (ifVerified && ifVerified == true) {
				res.json(
					new AppResponse({
						reqPath: req.originalUrl,
						success: new AppSuccessResponse({
							message: `user successfully verified`,
						}),
					})
				)
			} else {
				next(
					new AppErrorResponse({
						message: `can't verify email`,
						statusCode: StatusCodes.BAD_REQUEST,
					})
				)
			}
		} catch (err) {
			next(err)
		}
	}
}
