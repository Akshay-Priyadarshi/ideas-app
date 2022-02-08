import { Document } from 'mongoose'
import { IDownvote } from '../database/downvote.model'

export type CreateDownvoteDto = IDownvote

export interface DownvoteDatabaseResponse extends IDownvote, Document {}
