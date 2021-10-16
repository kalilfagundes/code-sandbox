import { Response } from 'express'
import { ValidationError } from 'yup'

function handle({ inner, errors }: ValidationError, response: Response) {
  const errorMessages: string[] = []

  if (inner.length) {
    inner.forEach(({ errors: messages }) => {
      errorMessages.push(...messages)
    })
  } else {
    errorMessages.push(...errors)
  }

  response
    .status(422)
    .json({ error: errorMessages })
}

export default handle
