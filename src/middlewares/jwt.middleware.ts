import { NextFunction, Request, Response } from 'express'
import { JsonWebTokenError, verify } from 'jsonwebtoken'
import { User } from '../database/user.model'
import { AuthenticationError } from '../responses/error.response'
import { getEnv } from '../utils/env.util'

export async function JwtMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		if (req.headers.authorization) {
			const bearerSignedAuthToken = req.headers.authorization.split(' ')[1]
			const jwtPayload = verify(
				bearerSignedAuthToken,
				getEnv('JWT_SECRET') as string
			)
			const signedInUser = await User.findOne({
				_id: jwtPayload.sub,
			}).select(['email', 'authLevel'])
			req.user = signedInUser
		}
		next()
	} catch (err) {
		if (err instanceof JsonWebTokenError) {
			next(
				new AuthenticationError({
					message: 'you have somehow been logged out, try logging in again',
				})
			)
		} else {
			next(err)
		}
	}
}
