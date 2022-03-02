import { Request } from 'express'
import { getEnv } from './env.util'

/**
 * @name getReqBaseUrl
 * @param {Request} req Express request
 * @returns {string} Base URL of request
 * @description Returns base URL from the current express request
 * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
 */
export const getReqBaseUrl = (req: Request): string => {
	const reqUrl = req.baseUrl
	const reqBaseUrl = `${getBaseUrl(req)}${reqUrl}`
	return reqBaseUrl
}

/**
 * @name getBaseUrl
 * @param {Request} req Express request
 * @returns {string} Base URL
 * @description Returns base URL from express request
 * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
 */
export const getBaseUrl = (req: Request): string => {
	console.log(req.hostname)
	const isDev = process.env.NODE_ENV === 'development'
	const PORT = getEnv('PORT')
	const hostname = isDev ? `${req.hostname}:${PORT}` : `${req.hostname}`
	const protocol = isDev ? 'http' : 'https'
	const baseUrl = `${protocol}://${hostname}`
	return baseUrl
}

/**
 * @name getUserVerifyRedirectUrl
 * @param {Request} req Express request
 * @param {string} token Signed JWT token
 * @returns {string} User verify redirect URL
 * @description Returns user verify redirect URL from express request & signed JWT token
 * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
 */
export const getUserVerifyRedirectUrl = (
	req: Request,
	token: string
): string => {
	const verifyUrl = `${getBaseUrl(req)}/api/users/verify-user-redirect/${token}`
	return verifyUrl
}
