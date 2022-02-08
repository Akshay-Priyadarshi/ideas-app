import { JwtPayload, sign, verify } from 'jsonwebtoken'
import { getEnv } from './env.util'

/**
 * @name getSignedJwtToken
 * @param {JwtPayload} payload Jwt Payload
 * @param {string} secretKey Secret key
 * @returns {string} Signed Token
 * @description Return signed token from JWT payload & JWT secret key
 * @author Akshay Priyadarshi <akshayp1904@outlook.com>
 */
export function getSignedJwtToken(
	payload: JwtPayload,
	secretKey: string
): string {
	const JWT_SECRET = getEnv(secretKey) as string
	const signedJwtToken = sign(payload, JWT_SECRET)
	return signedJwtToken
}

/**
 * @name getPayloadFromJwt
 * @param {string} signedToken Signed JWT token
 * @param {string} secretKey Secret key
 * @returns {string | Payload} JWT payload
 * @description Return JWT payload from JWT signed token & JWT secret key
 */
export function getPayloadFromJwt(
	signedToken: string,
	secretKey: string
): string | JwtPayload {
	const JWT_SECRET = getEnv(secretKey) as string
	const jwtPayload = verify(signedToken, JWT_SECRET)
	return jwtPayload
}
