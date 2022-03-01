import { Request } from 'express'
import { Location, matchedData, MatchedDataOptions } from 'express-validator'

export const sanitisedData = (
	req: Request,
	options: Partial<MatchedDataOptions>
) => {
	const sanitisedData: Record<Location, any> = {
		body: matchedData(req, { ...options, locations: ['body'] }),
		query: matchedData(req, { ...options, locations: ['query'] }),
		params: matchedData(req, { ...options, locations: ['params'] }),
		cookies: matchedData(req, { ...options, locations: ['cookies'] }),
		headers: matchedData(req, { ...options, locations: ['headers'] }),
	}
	req.body = sanitisedData.body
	req.params = sanitisedData.params
	req.query = sanitisedData.query
	req.headers = sanitisedData.headers
	req.cookies = sanitisedData.cookies
}
