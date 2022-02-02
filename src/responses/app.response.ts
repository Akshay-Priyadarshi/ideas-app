import { AppErrorResponse } from './error.response'
import { AppSuccessResponse } from './success.response'

export interface IAppResponse {
	error?: AppErrorResponse[] | AppErrorResponse | undefined
	success?: AppSuccessResponse | undefined
	reqPath: string
}

export class AppResponse {
	error: AppErrorResponse[] | AppErrorResponse | undefined
	success: AppSuccessResponse | undefined
	reqPath: string

	constructor(_: IAppResponse) {
		this.reqPath = _.reqPath
		this.success = _.success
		this.error = _.error
	}
}
