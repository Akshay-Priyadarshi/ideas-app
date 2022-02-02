import express from 'express'
import dotenv from 'dotenv'
import { JwtMiddleware } from './middlewares/jwt.middleware'
import { ErrorMiddleware } from './middlewares/error.middleware'
import { ensureDatabaseConnection } from './utils/db.util'
import { getEnv } from './utils/env.util'
import { RootRouter } from './routers/root.router'

// Configuring environment variables
if (process.env.NODE_ENV === 'development') {
	dotenv.config()
}

// Setting PORT constant
const PORT = parseInt(getEnv('PORT') as string) || 8080

// Initializing express application
const app = express()

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
ensureDatabaseConnection().then(() => {
	app.listen(PORT, () => {
		console.log(`🚀 Server listening at http://localhost:${PORT}/`)
	})
})
