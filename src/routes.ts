import { Router } from 'express'

import languages, { createRuntime } from './languages'
import { authenticate, RequestBody, validate } from './middlewares'


// Configure routing object
const router = Router()

// List all supported languages in any GET request
if (process.env.NODE_ENV === 'development') {
  router.get('*', (_request, response) => {
    response.json(languages.all())
  })
}

// Run service of code compilation and execution
router.post('/', authenticate(), validate(), async (request, response) => {
  const { lang, code, params = [] } = request.body as RequestBody
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const language = languages.get(lang)! // validation ensures language is not null
  const runtime = createRuntime(language)
  const outputs = await runtime.execute(code, params)

  return response
    .status(200)
    .json(outputs)
})

export default router
