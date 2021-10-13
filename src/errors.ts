import { ErrorRequestHandler } from 'express'

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next, // eslint-disable-line @typescript-eslint/no-unused-vars
  // MUST CONTAIN 4 PARAMETERS
) => {
  // if (error instanceof SomeError) {
  //   return error.handle(response)
  // }

  console.error(error.stack)
  return response.status(500).json({ error: error.message })
}
