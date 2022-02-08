import { Router } from 'express'
import { IdeaController } from '../controllers/idea.controller'

export const IdeaRouter = Router()
const ideaController = new IdeaController()

IdeaRouter.get('/count', ideaController.getIdeaCount)

IdeaRouter.get('/', ideaController.getAllIdeas)

IdeaRouter.get('/:ideaId', ideaController.getIdeaById)

IdeaRouter.post('/', ideaController.createIdea)

IdeaRouter.put('/:ideaId', ideaController.updateIdea)

IdeaRouter.delete('/:ideaId', ideaController.deleteIdea)
