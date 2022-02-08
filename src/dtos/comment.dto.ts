import { Document } from 'mongoose'
import { IComment } from '../database/comment.model'

export interface CommentDatabaseResponse extends IComment, Document {}
