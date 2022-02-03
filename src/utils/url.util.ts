import { Request } from 'express'
import { getEnv } from './env.util'

export const getReqBaseUrl = (req: Request): string => {
	const reqUrl = req.baseUrl
	const reqBaseUrl = `${getBaseUrl(req)}${reqUrl}`
	return reqBaseUrl
}

export const getBaseUrl = (req: Request) => {
	const isDev = process.env.NODE_ENV === 'development'
	const PORT = getEnv('PORT')
	const hostname = isDev ? `${req.hostname}:${PORT}` : `${req.hostname}`
	const protocol = isDev ? 'http' : 'https'
	const baseUrl = `${protocol}://${hostname}`
	return baseUrl
}

export const getUserVerifyRedirectUrl = (
	req: Request,
	token: string
): string => {
	const verifyUrl = `${getBaseUrl(req)}/api/users/verify-user-redirect/${token}`
	return verifyUrl
}
