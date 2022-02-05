import { JwtPayload, sign, verify } from 'jsonwebtoken'
import { getEnv } from './env.util'

export function getSignedJwtToken(
	payload: JwtPayload,
	secretKey: string
): string {
	const JWT_SECRET = getEnv(secretKey) as string
	const signedJwtToken = sign(payload, JWT_SECRET)
	return signedJwtToken
}

export function getPayloadFromJwt<T>(
	signedToken: string,
	secretKey: string
): string | JwtPayload {
	const JWT_SECRET = getEnv(secretKey) as string
	const jwtPayload = verify(signedToken, JWT_SECRET)
	return jwtPayload
}
