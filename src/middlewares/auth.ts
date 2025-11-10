import { RequestHandler } from 'express'

/**
 * Middleware de autenticação usando API Key
 * Valida o header Authorization: Bearer <token>
 */
export function authenticate(): RequestHandler {
  return (request, response, next) => {
    const apiKey = process.env.API_KEY

    // Se API_KEY não está configurada no ambiente, permite acesso
    if (!apiKey) {
      return next()
    }

    // Extrai o token do header Authorization
    const authHeader = request.headers.authorization
    
    if (!authHeader) {
      return response.status(401).json({ 
        error: 'Autenticação necessária. Forneça o header Authorization.' 
      })
    }

    // Valida o formato "Bearer <token>"
    const [scheme, token] = authHeader.split(' ')

    if (scheme !== 'Bearer' || !token) {
      return response.status(401).json({ 
        error: 'Formato de autenticação inválido. Use: Authorization: Bearer <api_key>' 
      })
    }

    // Valida se o token corresponde à API key configurada
    if (token !== apiKey) {
      return response.status(401).json({ 
        error: 'API key inválida.' 
      })
    }

    // Token válido, permite continuar
    next()
  }
}

