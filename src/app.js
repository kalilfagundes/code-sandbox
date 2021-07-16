import express from 'express'
import languages from './lang.js'

const app = express()

app.use(express.json())

app.post('/', async (request, response) => {
  const { code, id, lang } = request.body
  const inputFile = `./tmp/${id}/farma-alg`

  if (!languages[lang]) {
    return response
      .status(400)
      .json({ message: `Language '${lang}' not supported.` })
  }

  const output = await languages[lang].run(inputFile, code)

  return response
    .status(200)
    .json({ output })
})

export default app
