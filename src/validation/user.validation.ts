import { body, param } from 'express-validator'

const userIdCheck = param('userId')
	.exists({ checkFalsy: true })
	.isMongoId()
	.withMessage('invalid user ID')

export const userGetByIdVS = [userIdCheck]

export const userUpdateVS = [
	param('userId').isMongoId().withMessage('invalid user ID'),
	body('email').optional().isEmail().withMessage('email is invalid'),
]
