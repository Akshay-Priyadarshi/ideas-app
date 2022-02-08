import { NextFunction, Request, Response, Router } from 'express'
import { Idea } from '../database/idea.model'
import { getPaginationDataFromQuery } from '../utils/transform.util'

export const IdeaRouter = Router()

IdeaRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
	const paginationData = getPaginationDataFromQuery(req.query)
	const ideas = await Idea.find({}, {}, paginationData).populate('ideator')
	res.json(ideas)
})

IdeaRouter.get(
	'/:ideaId',
	async (req: Request, res: Response, next: NextFunction) => {
		const idea = await Idea.findOne({ _id: req.params.ideaId })
		idea?.upvote()
		idea?.save()
		res.json(idea)
	}
)

IdeaRouter.post(
	'/',
	async (req: Request, res: Response, next: NextFunction) => {
		const createdIdea = await Idea.create(req.body)
		res.json(await createdIdea.save())
	}
)
