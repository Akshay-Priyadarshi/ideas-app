import { hashSync, compareSync, genSaltSync } from 'bcrypt'
import { SALT_ROUNDS } from './constant.util'

/**
 * @name verifyPassword
 * @param {string} plainTextPassword Password in plain text
 * @param {string} encryptedPassword Encrypted password
 * @returns {boolean} Whether the two passwords match
 * @description Takes plain text password and encrypted password and compare whether the passwords match
 * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
 */
export function verifyPassword(
	plainTextPassword: string,
	encryptedPassword: string
): boolean {
	return compareSync(plainTextPassword, encryptedPassword) ? true : false
}

/**
 * @name encryptPassword
 * @param {string} plainTextPassword Password in plain text
 * @returns {string} Encrypted password
 * @description Return encrypted password from plain text password
 * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
 */
export function encryptPassword(plainTextPassword: string): string {
	const salt = genSaltSync(SALT_ROUNDS)
	const encryptedPassword = hashSync(plainTextPassword, salt)
	return encryptedPassword
}
