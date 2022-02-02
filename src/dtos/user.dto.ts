import { Document } from 'mongoose'
import { IUser } from '../database/user.model'

export type CreateUserDto = Omit<IUser, 'role'>

export type UpdateUserDto = Partial<CreateUserDto>

export interface UserDatabaseResponse extends IUser, Document {}

export interface UserPasswordResetDto {
	old: string
	new: string
}
