import { NextFunction, Request, Response } from 'express'
import { AppResponse } from '../responses/app.response'
import { AppErrorResponse } from '../responses/error.response'

export function ErrorMiddleware(
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (error instanceof AppErrorResponse) {
		console.log(error)
		console.log('Error is known')
		res.status((error as AppErrorResponse).statusCode)
		const appResponse = new AppResponse({ reqPath: req.url, error: error })
		res.json(appResponse)
	} else {
		console.log(error)
		console.log('Error is unknown')
		res.status(500).send('something wrong happened')
	}
}
