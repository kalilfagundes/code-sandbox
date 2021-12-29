import 'express-async-errors'
import cors from 'cors'
import express from 'express'

import { errorHandler } from './errors'
import routes from './routes'

// Configure application server
const server = express()
server.use(express.json())
server.use(cors())
server.use(routes)
server.use(errorHandler)

export default server
