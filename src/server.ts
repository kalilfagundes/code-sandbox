import express from 'express'
import { languages } from './languages'
import runSourceCode from './code-runner'

export interface RequestBody {
  key: string
  lang: string
  code: string
}

const server = express()

server.use(express.json())

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
