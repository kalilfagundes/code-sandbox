/* eslint-disable no-template-curly-in-string */
import { RequestHandler } from 'express'
import * as Yup from 'yup'

import languages from '../languages'

// Expected incoming request JSON body
export interface RequestBody {
  lang: string
  code: string
  params?: string[]
}

// Define request validation schema
const validationSchema = Yup.object().shape({
  lang: Yup.string()
    .required("Property '${path}' is mandatory.")
    .test({
      message: "Language ID '${value}' is not supported.",
      test(value = '') {
        const testContext = this as Yup.TestContext<{ languages: string[] }>
        const schemaContext = testContext.options.context
        const exists = schemaContext?.languages.includes(value) ?? false

        return exists
      },
    }),
  code: Yup.string()
    .required("Property '${path}' is mandatory."),
  params: Yup.array().optional().of(Yup.string()),
})

export function validate(): RequestHandler {
  return async (request, _response, next) => {
    request.body = await validationSchema.validate(request.body, {
      abortEarly: false,
      context: {
        // must get languages at runtime to avoid unfinished language loading
        languages: languages.all().map(({ id }) => id),
      },
    })

    next()
  }
}
