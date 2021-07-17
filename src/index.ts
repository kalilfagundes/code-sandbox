import 'dotenv/config'
import server from './server'

server.listen(process.env.SERVER_PORT, () => {
  console.log(`Listening at http://localhost:${process.env.SERVER_PORT}`)
})
