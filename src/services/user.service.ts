import { verify } from 'jsonwebtoken'
import { User } from '../database/user.model'
import {
	CreateUserDto,
	UpdateUserDto,
	UserDatabaseResponse,
	UserPasswordResetDto,
} from '../dtos/user.dto'
import {
	AppErrorResponse,
	ClientError,
	ClientErrorContext,
} from '../responses/error.response'
import { getEnv } from '../utils/env.util'
import { verifyPassword } from '../utils/password.util'

export class UserService {
	constructor() {}

	/**
	 * Get all users
	 * @returns {Promise<UserDatabaseResponse[]>}
	 * @description Get all users
	 * @author Akshay Priyadarshi <akshayp1904@outlook.com>
	 */
	getAllUsers = async (): Promise<UserDatabaseResponse[]> => {
		const users = await User.find()
		return users
	}

	/**
	 * Get all users without profile
	 * @returns {Promise<UserDatabaseResponse[]>}
	 * @description Get all users without their profile
	 * @author Akshay Priyadarshi <akshayp1904@outlook.com>
	 */
	getAllUsersWithoutProfile = async (): Promise<UserDatabaseResponse[]> => {
		const users = await User.find().select({ profile: 0 })
		return users
	}

	/**
	 * Get user by id
	 * @param {string} id User id
	 * @returns {Promise<UserDatabaseResponse | null>} User
	 * @description Get user with specified id
	 * @author Akshay Priyadarshi <akshayp1904@outlook.com>
	 */
	getUserById = async (id: string): Promise<UserDatabaseResponse | null> => {
		const user = await User.findOne({ _id: id })
		return user
	}

	getUserByIdWithoutProfile = async (
		id: string
	): Promise<UserDatabaseResponse | null> => {
		const user = await User.findOne({ _id: id }).select({ profile: 0 })
		return user
	}

	/**
	 * Get user credentials by email
	 * @param {string} email Email of the user
	 * @returns {Promise<UserDatabaseResponse> | null>} Login credentials of the user
	 * @description Fetches the user corresponding to an email
	 * @author Akshay Priyadarshi <akshayp1904@outlook.com>
	 */
	getCompleteUserByEmail = async (
		email: string
	): Promise<UserDatabaseResponse | null> => {
		const user = await User.findOne({ email }).select({
			password: 1,
			authLevel: 1,
		})
		return user
	}

	getCompleteUserById = async (id: string) => {
		const user = await User.findOne({ _id: id }).select({
			password: 1,
			authLevel: 1,
		})
		return user
	}

	/**
	 * Create User
	 * @param {CreateUserDto} createUserDto Object for creating user
	 * @returns {Promise<UserDatabaseResponse | null | undefined} Create user
	 * @description Create a user with specified user object
	 * @author Akshay Priyadarshi <akshayp1904@outlook.com>
	 */
	createUser = async (
		createUserDto: CreateUserDto
	): Promise<UserDatabaseResponse | null> => {
		const userWithEmail = await this.getCompleteUserByEmail(createUserDto.email)
		if (userWithEmail != null) {
			throw new ClientError({
				message: 'email already registered',
				context: ClientErrorContext.BODY,
				path: 'email',
			})
		}
		const newUser = await User.create(createUserDto)
		const savedUser = await newUser.save()
		return await this.getUserById(savedUser.id)
	}

	/**
	 * Update user
	 * @param {string} id Id of the user to be updated
	 * @param {UpdateUserDto} updateUserDto User fields to be updated
	 * @returns {Promise<UserDatabaseResponse | null | undefined>} Updated user
	 * @description Updates user with the given user id and returns updated user
	 * @author Akshay Priyadarshi <akshayp1904@outlook.com>
	 */
	updateUser = async (
		id: string,
		updateUserDto: UpdateUserDto
	): Promise<UserDatabaseResponse | null | undefined> => {
		const updateResult = await User.updateOne({ _id: id }, updateUserDto, {
			runValidators: true,
		})
		if (updateResult.modifiedCount == 1) {
			const updatedUser = await this.getUserById(id)
			return updatedUser
		}
	}

	/**
	 * Delete User
	 * @param {string} id User Id
	 * @returns {Promise<UserDatabaseResponse | null | undefined>} Deleted user
	 * @description Deletes the user corresponding to the user id
	 * @author Akshay Priyadarshi <akshayp1904@outlook.com>
	 */
	deleteUser = async (
		id: string
	): Promise<UserDatabaseResponse | null | undefined> => {
		const deletedUser = await User.findOne({ _id: id })
		if (deletedUser) {
			const deleteResult = await User.deleteOne({ _id: id })
			if (deleteResult.deletedCount == 1) {
				return deletedUser
			} else {
				throw new AppErrorResponse({ message: 'could not delete user' })
			}
		}
	}

	/**
	 * Reset User Password
	 * @param id User id
	 * @param passwordResetDto Combination of old and new password
	 * @returns {Promise<boolean | undefined>} True if password reset is successful and false otherwise
	 * @description Resets password of user with the specified user id, compares the old password, resets the password to the new value and returns true if successfully reset otherwise false
	 * @author Akshay priyadarshi <akshayp1904@outlook.com>
	 */
	resetUserPassword = async (
		id: string,
		passwordResetDto: UserPasswordResetDto
	): Promise<boolean | undefined> => {
		if (passwordResetDto.new === passwordResetDto.old) {
			throw new ClientError({
				message: 'new password must not be same as old password',
				context: ClientErrorContext.BODY,
				path: 'new',
			})
		}
		const user = await User.findOne({ _id: id }).select({ password: 1 })
		if (user) {
			if (verifyPassword(passwordResetDto.old, user.password)) {
				const updateResult = await user.updateOne(
					{ password: passwordResetDto.new },
					{ runValidators: true }
				)
				if (updateResult.modifiedCount === 1) {
					return true
				}
			} else {
				throw new ClientError({
					message: `your current password doesn't seem right`,
					context: ClientErrorContext.BODY,
					path: 'old',
				})
			}
		}
		return false
	}

	verifyUserRedirect = async (
		signedToken: string
	): Promise<boolean | undefined> => {
		let ifVerified = false
		const jwtPayload = verify(
			signedToken,
			getEnv('JWT_VERIFY_USER_SECRET') as string
		)
		if (jwtPayload && jwtPayload.sub) {
			const user = await this.getUserById(jwtPayload.sub as string)
			if (user) {
				if (user.verified === true) {
					throw new AppErrorResponse({
						message: 'user already verified',
					})
				}
				await user.updateOne({ verified: true }, { runValidators: true })
				ifVerified = true
			}
		}
		return ifVerified
	}
}
