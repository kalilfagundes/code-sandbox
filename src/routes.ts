import { Router } from 'express'
import languages, { createRuntime } from './languages'

// Expected incoming request JSON body
export interface RequestBody {
  lang: string
  code: string
  params?: string[]
}

// Configure routing object
const router = Router()

// List all supported languages in any GET request
if (process.env.NODE_ENV === 'development') {
  router.get('*', (_request, response) => {
    response.json(languages.all())
  })
}

// Run service of code compilation and execution
router.post('/', async (request, response) => {
  const { lang, code, params = [] } = request.body as RequestBody
  const language = languages.get(lang)

  if (!language) {
    return response
      .status(400)
      .json({ error: `Language "${lang}" not supported by the service` })
  }

  const runtime = createRuntime(language)
  const outputs = await runtime.execute(code, params)

  return response
    .status(200)
    .json(outputs)
})

export default router
