import { Router } from 'express'
import { AuthRouter } from './auth.router'
import { UserRouter } from './user.router'

export const RootRouter = Router()

RootRouter.get('/', (req, res) => {
	res.status(200).send('✔️ Server is running fine')
})

RootRouter.use('/users', UserRouter)

RootRouter.use('/auth', AuthRouter)

RootRouter.get('/*', (req, res) => {
	res.send('Undefined API')
})
