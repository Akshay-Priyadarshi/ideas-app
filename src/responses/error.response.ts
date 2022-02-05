import { Location } from 'express-validator'
import { StatusCodes } from 'http-status-codes'

export interface IAppErrorResponse {
	message: string
	statusCode?: number
	reason?: string
	helpers?: [string]
}

export class AppErrorResponse extends Error {
	msg: string
	statusCode: number
	reason?: string
	helpers?: [string]

	constructor(_: IAppErrorResponse) {
		super(_.message)
		this.name = 'AppError'
		this.msg = _.message
		this.statusCode = _.statusCode
			? _.statusCode
			: StatusCodes.INTERNAL_SERVER_ERROR
		this.reason = _.reason
		this.helpers = _.helpers
	}
}

export enum ClientErrorContext {
	BODY = 'body',
	QUERY = 'query',
	PARAMS = 'params',
	COOKIES = 'cookies',
	HEADERS = 'headers',
}

export interface IClientError extends IAppErrorResponse {
	context: Location
	path: string
}

export class ClientError extends AppErrorResponse {
	context: string
	path: string

	constructor(_: IClientError) {
		super({
			message: _.message,
			statusCode: _.statusCode ? _.statusCode : StatusCodes.BAD_REQUEST,
			reason: _.reason,
			helpers: _.helpers,
		})
		this.name = 'ClientError'
		this.context = _.context
		this.path = _.path
	}
}

export class AuthenticationError extends AppErrorResponse {
	constructor(_: IAppErrorResponse) {
		super({
			message: _.message,
			statusCode: _.statusCode ? _.statusCode : StatusCodes.UNAUTHORIZED,
			helpers: _.helpers,
			reason: _.reason,
		})
		this.name = 'AuthenticationError'
	}
}

export class AuthorizationError extends AppErrorResponse {
	constructor(_: IAppErrorResponse) {
		super({
			message: _.message,
			statusCode: _.statusCode ? _.statusCode : StatusCodes.FORBIDDEN,
		})
		this.name = 'AuthorizationError'
	}
}
