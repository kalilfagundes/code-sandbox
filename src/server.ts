import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import routes from './routes'
import { errorHandler } from './errors'

// Configure application server
const server = express()
server.use(express.json())
server.use(cors())
server.use(routes)
server.use(errorHandler)

export default server
