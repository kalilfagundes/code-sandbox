import 'dotenv/config'
import server from './server'

// Initialize application server
server.listen(process.env.SERVER_PORT, () => {
  console.log(`Listening at http://localhost:${process.env.SERVER_PORT}`)
})
