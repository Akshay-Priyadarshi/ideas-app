import { NextFunction, Request, Response } from 'express'
import { AppResponse } from '../responses/app.response'
import { AppErrorResponse } from '../responses/error.response'
import { AppSuccessResponse } from '../responses/success.response'
import { IdeaService } from '../services/idea.service'
import { getPaginationDataFromQuery } from '../utils/transform.util'

export class IdeaController {
	constructor(private ideaService = new IdeaService()) {}

	getIdeaCount = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const ideaCount = await this.ideaService.getIdeaCount()
			const appResponse = new AppResponse({
				reqPath: req.originalUrl,
				success: new AppSuccessResponse({
					data: ideaCount,
				}),
			})
			res.json(appResponse)
		} catch (err) {
			next(err)
		}
	}

	getAllIdeas = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const paginationData = getPaginationDataFromQuery(req.query)
			const ideas = await this.ideaService.getAllIdeas(paginationData)
			const appResponse = new AppResponse({
				reqPath: req.originalUrl,
				success: new AppSuccessResponse({
					data: ideas,
				}),
			})
			res.json(appResponse)
		} catch (err) {
			next(err)
		}
	}

	getIdeaById = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const idea = await this.ideaService.getIdeaById(req.params.ideaId, true)
			const appResponse = new AppResponse({
				reqPath: req.originalUrl,
				success: new AppSuccessResponse({
					data: idea,
				}),
			})
			res.json(appResponse)
		} catch (err) {
			next(err)
		}
	}

	createIdea = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const idea = await this.ideaService.createIdea(req.body)
			const appResponse = new AppResponse({
				reqPath: req.originalUrl,
				success: new AppSuccessResponse({
					data: idea,
					message: `idea successfully created`,
				}),
			})
			res.json(appResponse)
		} catch (err) {
			next(err)
		}
	}

	updateIdea = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const idea = await this.ideaService.updateIdea(
				req.params.ideaId,
				req.body
			)
			const appResponse = new AppResponse({
				reqPath: req.originalUrl,
				success: new AppSuccessResponse({
					data: idea,
					message: `idea successfully updated`,
				}),
			})
			res.json(appResponse)
		} catch (err) {
			next(err)
		}
	}

	deleteIdea = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const idea = await this.ideaService.deleteIdea(req.params.ideaId)
			const appResponse = new AppResponse({
				reqPath: req.originalUrl,
				success: new AppSuccessResponse({
					data: idea,
					message: `idea successfully deleted`,
				}),
			})
			res.json(appResponse)
		} catch (err) {
			next(err)
		}
	}

	downvoteIdea = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const downvoted = await this.ideaService.downvoteIdea(req.body)
			if (downvoted === false) {
				throw new AppErrorResponse({
					message: `couldn't downvote`,
				})
			}
			const appResponse = new AppResponse({
				reqPath: req.originalUrl,
				success: new AppSuccessResponse({
					message: `successfullly downvoted`,
				}),
			})
			res.json(appResponse)
		} catch (err) {
			next(err)
		}
	}
}
