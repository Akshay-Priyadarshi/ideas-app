export interface IAppSuccessResponse {
	data?: any
	message?: string | undefined
	statusCode?: number | undefined
}

export class AppSuccessResponse {
	data: any | undefined
	message: string | undefined
	statusCode: number

	constructor(_: IAppSuccessResponse) {
		this.data = _.data
		this.message = _.message
		this.statusCode = _.statusCode ? _.statusCode : 200
	}
}
