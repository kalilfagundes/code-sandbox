import 'dotenv/config'
import server from './server'

// Initialize application server
server.listen(process.env.PORT || 4444, () => {
  console.log(`Listening at http://localhost:${process.env.PORT || 4444}`)
})
