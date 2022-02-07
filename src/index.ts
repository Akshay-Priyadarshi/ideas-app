import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import cors from 'cors'
import { JwtMiddleware } from './middlewares/jwt.middleware'
import { ErrorMiddleware } from './middlewares/error.middleware'
import { ensureDatabaseConnection } from './utils/db.util'
import { getEnv } from './utils/env.util'
import { RootRouter } from './routers/root.router'
import { ENV_PORT } from './utils/constant.util'

// Configuring environment variables
if (process.env.NODE_ENV === 'development') {
	dotenv.config()
}

// Setting PORT constant
const PORT = parseInt(getEnv(ENV_PORT) as string) || 8080

// Initializing express application
// deepcode ignore UseCsurfForExpress: <I am not using sessions>
const app = express()

// Applying security middlewares
app.use(cors())
app.use(helmet())

// Applying all req middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Authentication & Authorization middleware
app.use(JwtMiddleware)

// Connecting to root router
app.use('/api', RootRouter)

// Error handler middleware
app.use(ErrorMiddleware)

// Ensure database connection and start server
ensureDatabaseConnection()
	.then(() => {
		console.log('🚀 Database connection ensured')
	})
	.then(() => {
		app.listen(PORT, () => {
			console.log(`🚀 Server listening at http://localhost:${PORT}/api`)
		})
	})
	.catch((err) => console.error(err))
