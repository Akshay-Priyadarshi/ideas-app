import mongoose from 'mongoose'
import { ENV_DB_URL } from './constant.util'
import { getEnv } from './env.util'

/**
 * @name ensureDatabaseConnection
 * @description Ensures connection with database and logs the status
 * @author Akshay Priyadarshi <https://github.com/Akshay-Priyadarshi>
 */
export async function ensureDatabaseConnection(): Promise<void> {
	const DB_URL = getEnv(ENV_DB_URL) as string
	await mongoose.connect(DB_URL)
}
