import { NextFunction, Request, Response } from 'express'
import { JsonWebTokenError } from 'jsonwebtoken'
import { User } from '../database/user.model'
import { AuthenticationError } from '../responses/error.response'
import { ENV_ACCESS_TOKEN_SECRET } from '../utils/constant.util'
import { getPayloadFromJwt } from '../utils/jwt.util'

export async function JwtMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		if (req.headers.authorization) {
			const bearerSignedAuthToken = req.headers.authorization.split(' ')[1]
			const jwtPayload = getPayloadFromJwt(
				bearerSignedAuthToken,
				ENV_ACCESS_TOKEN_SECRET
			)
			const signedInUser = await User.findOne({
				_id: jwtPayload.sub,
			})
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
