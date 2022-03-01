import {
	ErrorFormatter,
	ValidationError,
	validationResult,
} from 'express-validator'
import { Request } from 'express'
import { ClientError, ClientErrorContext } from '../responses/error.response'

/**
 * @name getClientErrors
 * @param {Request} req Express request
 * @returns {ClientError[] | null} Client errors
 * @description Returns client errors from the express request
 * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
 */
export const getClientErrors = (req: Request): ClientError[] => {
	const result = validationResult(req).formatWith(clientErrorFormatter)
	if (result.isEmpty()) {
		return []
	}
	return result.array()
}

/**
 * @name clientErrorFormatter
 * @param {ValidationError} err Express validator validation error
 * @returns {ClientError} Client Error
 * @description Format error of type ValidationError into ClientError
 * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
 */
export const clientErrorFormatter: ErrorFormatter<ClientError> = (
	err: ValidationError
): ClientError => {
	const clientError = new ClientError({
		message: err.msg,
		context: err.location as ClientErrorContext,
		path: err.param,
	})
	return clientError
}
