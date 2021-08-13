import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import { languages } from './languages'
import runSourceCode from './code-runner'

export interface RequestBody {
  key: string
  lang: string
  code: string
}

const server = express()

server.use(cors())
server.use(express.json())

server.get('*', (_request, response) => {
  response
    .status(200)
    .send(`
      <div style="display: flex; flex-direction: column; align-items: center;">
        <h1>FarmaAlg Sandbox</h1>
        <p>Supported languages:</p>
        <ul>${languages.map(({ name }) => `<li>${name.toUpperCase()}</li>`).join('')}</ul>
      </div>
    `)
})

server.post('/', async (request, response) => {
  const { key, lang, code } = request.body as RequestBody
  const language = languages.find(({ name }) => name === lang)

  if (!language) {
    return response
      .status(400)
      .json({ message: `Language '${lang}' not supported.` })
  }

  const output = await runSourceCode(key, code, language)

  return response
    .status(200)
    .json({ output })
})

export default server
