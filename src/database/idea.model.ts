import { model, ObjectId, Schema } from 'mongoose'

export interface IIdea {
	title: string
	desc: string
	author: ObjectId
}

const ideaSchema = new Schema({
	title: { type: String, required: true, trim: true, select: true },
})

export const Idea = model('Model', ideaSchema)
