import {
	ErrorFormatter,
	ValidationError,
	validationResult,
} from 'express-validator'
import { Request } from 'express'
import { ClientError, ClientErrorContext } from '../responses/error.response'

export const getClientErrors = (req: Request): ClientError[] | null => {
	const result = validationResult(req).formatWith(clientErrorFormatter)
	if (result.array().length > 0) {
		return result.array()
	}
	return null
}

export const clientErrorFormatter: ErrorFormatter<ClientError> = (
	err: ValidationError
) => {
	const clientError = new ClientError({
		message: err.msg,
		context: err.location as ClientErrorContext,
		path: err.param,
	})
	return clientError
}
