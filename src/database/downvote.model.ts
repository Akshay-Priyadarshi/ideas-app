import { model, ObjectId, Schema } from 'mongoose'
import {
	DOWNVOTE_MODEL_NAME,
	IDEA_MODEL_NAME,
	USER_MODEL_NAME,
} from '../utils/constant.util'

export interface IDownvote {
	idea: ObjectId
	downvoter: ObjectId
}

const downvoteSchema = new Schema<IDownvote>(
	{
		idea: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: IDEA_MODEL_NAME,
			select: true,
		},
		downvoter: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: USER_MODEL_NAME,
			select: true,
		},
	},
	{ timestamps: true }
)

export const Downvote = model(DOWNVOTE_MODEL_NAME, downvoteSchema)
