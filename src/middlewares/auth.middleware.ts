import { NextFunction, Request, Response } from 'express'
import { UserAuthLevel } from '../database/user.model'
import {
	AuthenticationError,
	AuthorizationError,
} from '../responses/error.response'

export function AuthenticationMiddleware() {
	return function (req: Request, res: Response, next: NextFunction) {
		if (req.user) {
			next()
		} else {
			next(
				new AuthenticationError({
					message: "you aren't authenticated, try logging in first",
				})
			)
		}
	}
}

export function AuthorizationMiddleware(allowedAuthLevel: UserAuthLevel) {
	return function (req: Request, res: Response, next: NextFunction) {
		if (req.user) {
			if (req.user.authLevel <= allowedAuthLevel) {
				next()
			} else {
				next(
					new AuthorizationError({
						message: "you don't have enough previleges to perform this action",
					})
				)
			}
		}
	}
}

export function SelfAuthorizationMiddleware() {
	return function (req: Request, res: Response, next: NextFunction) {
		if (req.user && req.params.userId) {
			if (
				req.user.id === req.params.userId ||
				req.user.authLevel === UserAuthLevel.ADMIN
			) {
				next()
			} else {
				next(
					new AuthorizationError({
						message: "you don't have enough previleges to perform this action",
					})
				)
			}
		}
	}
}
