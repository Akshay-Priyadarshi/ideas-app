import { UserDatabaseResponse } from '../../server/types/dtos/user.dto'

declare global {
	namespace Express {
		export interface Request {
			user: UserDatabaseResponse | null | undefined
		}
	}
}
