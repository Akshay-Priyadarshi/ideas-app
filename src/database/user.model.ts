import { model, Schema } from 'mongoose'
import { encryptPassword } from '../utils/password.util'
import { IProfile, profileSchema } from './profile.schema'

export enum UserAuthLevel {
	USER = 1,
	ADMIN = 0,
}

export interface IUser {
	email: string
	password: string
	authLevel: number
	verified: boolean
	profile: IProfile
}

const userSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			select: true,
			required: [true, 'email is required'],
			unique: true,
			index: true,
			trim: true,
		},
		password: {
			type: String,
			select: false,
			set: encryptPassword,
			required: [true, 'password is required'],
		},
		authLevel: {
			type: Number,
			select: false,
			enum: UserAuthLevel,
			default: UserAuthLevel.USER,
		},
		verified: { type: Boolean, default: false, select: true },
		profile: { type: profileSchema },
	},
	{ timestamps: true }
)

export const User = model<IUser>('User', userSchema)
