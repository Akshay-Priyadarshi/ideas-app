import { Schema } from 'mongoose'

export interface IDob {
	year: number | undefined
	month: number
	day: number
}

export const dobSchema = new Schema<IDob>(
	{
		year: { type: Number },
		month: { type: Number, required: [true, 'birth month is required'] },
		day: { type: Number, required: [true, 'birth day is required'] },
	},
	{ _id: false }
)
