import express from 'express'
import languages from './lang'

const app = express()

app.use(express.json())

app.post('/', async (request, response) => {
  const { code, id, lang } = request.body
  const inputFile = `${process.env.SANDBOX_DIR}/${lang}_${id}`
  const environment = languages.find((rt) => rt.name === lang)

  if (!environment) {
    return response
      .status(400)
      .json({ message: `Language '${lang}' not supported.` })
  }

  const output = await environment.run(inputFile, code)

  return response
    .status(200)
    .json({ output })
})

export default app
