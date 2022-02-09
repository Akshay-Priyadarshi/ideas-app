import { Document } from 'mongoose'
import { IUpvote } from '../database/upvote.model'

export interface CreateUpvoteDto {
	userId: string
	ideaId: string
}

export interface UpvoteDatabaseResponse extends IUpvote, Document {}
