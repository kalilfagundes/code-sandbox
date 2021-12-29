import { ErrorRequestHandler } from 'express'
import { ValidationError } from 'yup'

import handleValidationError from './validation'

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next, // eslint-disable-line @typescript-eslint/no-unused-vars
  // MUST CONTAIN 4 PARAMETERS
) => {
  if (error instanceof ValidationError) {
    return handleValidationError(error, response)
  }

  console.error(error.stack)
  return response.status(500).json({ error: error.message })
}
