import { body } from 'express-validator'

export const authSignupVS = [
	body('email').trim().toLowerCase().isEmail().withMessage('invalid email'),
	body('password')
		.trim()
		.matches(/^.{8,}$/)
		.withMessage('password must be 8 characters long')
		.matches(/^\w{8,}$/)
		.withMessage('password must not have any symbol'),
]
