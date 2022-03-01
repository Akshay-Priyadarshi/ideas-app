import { Document } from 'mongoose'
import { IUser } from '../database/user.model'

export type CreateUserDto = Pick<IUser, 'email' | 'password'>

export type UpdateUserDto = Partial<IUser>

export interface UserDatabaseResponse extends IUser, Document {}

export interface UserPasswordResetDto {
	old: string
	new: string
}
