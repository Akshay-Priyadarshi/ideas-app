import { NextFunction, Request, Response } from 'express'
import { UserRole } from '../database/user.model'
import {
	AuthenticationError,
	AuthorizationError,
} from '../responses/error.response'
import { USER_AUTH_LEVEL } from '../utils/constant.util'

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

export function AuthorizationMiddleware(minAllowedRole: UserRole) {
	return function (req: Request, res: Response, next: NextFunction) {
		if (req.user) {
			const role = req.user.role
			if (USER_AUTH_LEVEL[role] <= USER_AUTH_LEVEL[minAllowedRole]) {
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

export function SelfAndAdminAuthorizationMiddleware() {
	return function (req: Request, res: Response, next: NextFunction) {
		if (req.user && req.params.userId) {
			const role = req.user.role
			if (req.user.id === req.params.userId || role === UserRole.ADMIN) {
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
