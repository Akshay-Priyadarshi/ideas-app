import { UserDatabaseResponse } from '../../dtos/user.dto'

declare global {
	namespace Express {
		interface Request {
			user: UserDatabaseResponse | null | undefined
		}
	}
}
