import { model, Schema } from 'mongoose'
import { IDEA_MODEL_NAME, USER_MODEL_NAME } from '../utils/constant.util'

export interface IIdea {
	title: string
	desc: string
	solvedProblem: string
	upvotes: number
	downvotes: number
	ideator: Schema.Types.ObjectId
	upvote: () => void
}

const ideaSchema = new Schema<IIdea>(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			select: true,
			maxlength: 100,
		},
		upvotes: { type: Number, select: true, default: 0 },
		downvotes: { type: Number, select: true, default: 0 },
		desc: {
			type: String,
			required: true,
			trim: true,
			select: true,
			maxlength: 1000,
		},
		solvedProblem: { type: String, trim: true, select: true, maxlength: 1000 },
		ideator: {
			type: Schema.Types.ObjectId,
			ref: USER_MODEL_NAME,
			required: true,
			select: true,
		},
	},
	{ timestamps: true }
)

ideaSchema.method('upvote', function (this: IIdea) {
	this.upvotes += 1
})

export const Idea = model(IDEA_MODEL_NAME, ideaSchema)
