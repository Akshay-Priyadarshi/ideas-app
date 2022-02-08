import { Document } from 'mongoose'
import { IUpvote } from '../database/upvote.model'

export interface UpvoteDatabaseResponse extends IUpvote, Document {}
