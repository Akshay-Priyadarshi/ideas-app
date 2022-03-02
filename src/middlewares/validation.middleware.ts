import { NextFunction, Request, Response } from 'express'
import { MatchedDataOptions, ValidationChain } from 'express-validator'
import { getClientErrors } from '../utils/error.util'
import { sanitisedData } from '../utils/validator.util'

export function ValidationResultMiddleware(
	sanitiseOptions: Partial<MatchedDataOptions> = { onlyValidData: true }
) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const errors = getClientErrors(req)
			if (errors.length > 0) {
				next(errors)
			} else {
				sanitisedData(req, sanitiseOptions)
				next()
			}
		} catch (err) {
			next(err)
		}
	}
}

export function ValidationMiddleware(validationMiddlewares: ValidationChain[]) {
	return [...validationMiddlewares, ValidationResultMiddleware()]
}
