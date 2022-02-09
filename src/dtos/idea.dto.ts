import { Document } from 'mongoose'
import { IIdea } from '../database/idea.model'

export type CreateIdeaDto = IIdea

export type UpdateIdeaDto = Partial<CreateIdeaDto>

export interface IdeaDatabaseResponse extends IIdea, Document {
	ifIUpvoted?: boolean
	ifIDownvoted?: boolean
}
