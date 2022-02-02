import mongoose from 'mongoose'
import { getEnv } from './env.util'

/**
 * @description Ensures connection with database and logs the status
 * @author Akshay Priyadarshi <akshayp1904@outlook.com>
 */
export async function ensureDatabaseConnection(): Promise<void> {
	const DB_URL = getEnv('DB_URL') as string
	await mongoose
		.connect(DB_URL)
		.then(() => {
			console.log('🚀 Database connection ensured')
		})
		.catch((err) => console.error(err))
}
