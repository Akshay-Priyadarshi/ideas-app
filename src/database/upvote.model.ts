import { model, ObjectId, Schema } from 'mongoose'
import {
	IDEA_MODEL_NAME,
	UPVOTE_MODEL_NAME,
	USER_MODEL_NAME,
} from '../utils/constant.util'

export interface IUpvote {
	idea: ObjectId
	upvoter: ObjectId
}

const upvoteSchema = new Schema<IUpvote>(
	{
		idea: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: IDEA_MODEL_NAME,
			select: true,
		},
		upvoter: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: USER_MODEL_NAME,
			select: true,
		},
	},
	{ timestamps: true }
)

upvoteSchema.index({ idea: 1, upvoter: 1 }, { name: 'idea-upvoter' })

export const Upvote = model(UPVOTE_MODEL_NAME, upvoteSchema)
