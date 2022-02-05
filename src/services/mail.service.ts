import { MailDataRequired } from '@sendgrid/mail'
import {
	SENDER_MAIL,
	ENV_SGMAIL_KEY,
	VERIFY_EMAIL_TID,
} from '../utils/constant.util'
import { UserService } from './user.service'
import { getEnv } from '../utils/env.util'
import sgMail from '@sendgrid/mail'
import { StatusCodes } from 'http-status-codes'
import { AppErrorResponse } from '../responses/error.response'

export class MailService {
	constructor(private userService = new UserService()) {}

	helpers = {
		sendMail: (content: MailDataRequired | MailDataRequired[]) => {
			const SGMAIL_KEY = getEnv(ENV_SGMAIL_KEY) as string
			sgMail.setApiKey(SGMAIL_KEY)
			sgMail.send(content).catch((err) => {
				throw new AppErrorResponse({
					message: `can't send verification mail`,
					statusCode: StatusCodes.SERVICE_UNAVAILABLE,
				})
			})
		},
	}

	sendVerifyUserMail = async (
		userId: string,
		userVerifyRedirectUrl: string
	): Promise<void> => {
		const user = await this.userService.getUserById(userId)
		if (user && user.verified == false) {
			const mailContent: MailDataRequired = {
				from: SENDER_MAIL,
				to: user.email,
				templateId: VERIFY_EMAIL_TID,
				dynamicTemplateData: {
					name: user.profile ? user.profile.name.first : '',
					verifyLink: userVerifyRedirectUrl,
				},
			}
			this.helpers.sendMail(mailContent)
		} else {
			throw new AppErrorResponse({
				message: `can't send mail`,
				reason: `user is already verified`,
			})
		}
	}
}
