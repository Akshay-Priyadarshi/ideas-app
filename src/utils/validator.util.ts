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
	req.body = { ...req.body, ...sanitisedData.body }
	req.query = { ...req.query, ...sanitisedData.query }
	req.params = { ...req.params, ...sanitisedData.params }
	req.headers = { ...req.headers, ...sanitisedData.headers }
	req.cookies = { ...req.cookies, ...sanitisedData.cookies }
}
