import 'dotenv/config'
import app from './app.js'

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Listenning at http://localhost:${process.env.SERVER_PORT}`)
})
