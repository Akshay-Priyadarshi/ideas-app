import { Schema } from 'mongoose'

export interface IName {
	first: string
	middle: string | undefined
	last: string
}

export const nameSchema = new Schema(
	{
		first: {
			type: String,
			required: [true, 'first name is required'],
			trim: true,
		},
		middle: { type: String, trim: true },
		last: {
			type: String,
			required: [true, 'last name is required'],
			trim: true,
		},
	},
	{ _id: false }
)
