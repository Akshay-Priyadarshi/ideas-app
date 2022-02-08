import { Model, model, Schema } from 'mongoose'
import { USER_MODEL_NAME } from '../utils/constant.util'
import { encryptPassword } from '../utils/password.util'
import { IProfile, profileSchema } from './profile.schema'

export enum UserRole {
	ADMIN = 'ADMIN',
	USER = 'USER',
}

export interface IUser {
	email: string
	password: string
	role: UserRole
	verified: boolean
	profile: IProfile
}

export interface UserQueryHelpers {}

export interface IUserModel extends Model<IUser, UserQueryHelpers> {}

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
		role: {
			type: String,
			select: true,
			enum: UserRole,
			default: UserRole.USER,
		},
		verified: { type: Boolean, default: false, select: true },
		profile: { type: profileSchema, select: true },
	},
	{ timestamps: true }
)

export const User = model<IUser, IUserModel>(USER_MODEL_NAME, userSchema)
