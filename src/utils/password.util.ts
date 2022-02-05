import { hashSync, compareSync, genSaltSync } from 'bcrypt'
import { SALT_ROUNDS } from './constant.util'

/**
 * @param {string} plainTextPassword Password in plain text
 * @param {string} encryptedPassword Encrypted password
 * @returns {boolean} Whether the two passwords match
 * @description Takes plain text password and encrypted password and compare whether the passwords match
 * @author Akshay Priyadarshi <akshayp1904@outlook.com>
 */
export function verifyPassword(
	plainTextPassword: string,
	encryptedPassword: string
): boolean {
	return compareSync(plainTextPassword, encryptedPassword) ? true : false
}

/**
 * @param {string} plainTextPassword Password in plain text
 * @returns {string} Encrypted password
 * @description Return encrypted password from plain text password
 * @author Akshay Priyadarshi <akshayp1904@outlook.com>
 */
export function encryptPassword(plainTextPassword: string): string {
	const salt = genSaltSync(SALT_ROUNDS)
	const encryptedPassword = hashSync(plainTextPassword, salt)
	return encryptedPassword
}
