import 'dotenv/config'
import server from './server'

// Initialize application server
server.listen(process.env.PORT, () => {
  console.log(`Listening at http://localhost:${process.env.PORT}`)
})
