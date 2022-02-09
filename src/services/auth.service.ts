import { ILoginCredentialsDto, ILoginResponseDto } from '../dtos/auth.dto'
import { CreateUserDto, UserDatabaseResponse } from '../dtos/user.dto'
import { AuthenticationError } from '../responses/error.response'
import { ENV_ACCESS_TOKEN_SECRET } from '../utils/constant.util'
import { getSignedJwtToken } from '../utils/jwt.util'
import { verifyPassword } from '../utils/password.util'
import { UserService } from './user.service'

export class AuthService {
	// Internal user service
	constructor(private userService = new UserService()) {}

	/**
	 * Login
	 * @param {ILoginCredentialsDto} loginCredentials Object with email and password
	 * @returns {Promise<ILoginResponseDto | undefined>} Signed bearer token
	 * @description Login using email and password
	 * @author Akshay Priyadarshi <akshayp1904@outlook.com>
	 */
	async login(
		loginCredentials: ILoginCredentialsDto
	): Promise<ILoginResponseDto | undefined> {
		const user = await this.userService.getCompleteUserByEmail(
			loginCredentials.email
		)
		if (user) {
			if (verifyPassword(loginCredentials.password, user.password)) {
				const payload = { sub: user.id }
				const signedAuthToken = getSignedJwtToken(
					payload,
					ENV_ACCESS_TOKEN_SECRET
				)
				const signedBearerAuthToken = `Bearer ${signedAuthToken}`
				const loginResponse: ILoginResponseDto = {
					token: signedBearerAuthToken,
					loggedInUserId: user.id,
				}
				return loginResponse
			} else {
				throw new AuthenticationError({
					message: 'incorrect email & password combination',
				})
			}
		} else {
			throw new AuthenticationError({
				message: 'email not registered, try signing up first!',
			})
		}
	}

	/**
	 * Signup
	 * @param {CreateUserDto} createUserDto Object for creating user
	 * @returns {Promise<UserDatabaseResponse | null | undefined>} Created user
	 * @description Creates and return user
	 * @author Akshay Priyadarshi <akshayp1904@outlook.com>
	 */
	async signup(
		createUserDto: CreateUserDto
	): Promise<UserDatabaseResponse | null | undefined> {
		const signedupUser = await this.userService.createUser(createUserDto)
		return signedupUser
	}
}
