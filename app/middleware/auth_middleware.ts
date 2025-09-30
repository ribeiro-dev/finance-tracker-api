import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { IErrorResponse } from '../interfaces/responses.js'
import JwtUtil from '../utils/jwt.js'

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const authorization = ctx.request.header('Authorization', null)
    if (!authorization) {
      return ctx.response.unauthorized({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Unauthorized access',
        },
      } as IErrorResponse)
    }

    const accessToken = authorization.split('Bearer').pop()?.trim()
    if (!accessToken) {
      return ctx.response.unauthorized({
        error: {
          code: 'INVALID_TOKEN',
          message: 'The token is invalid',
        },
      } as IErrorResponse)
    }

    const data = JwtUtil.validate(accessToken)
    if (!data) {
      return ctx.response.unauthorized({
        error: {
          code: 'INVALID_TOKEN',
          message: 'The Token is invalid',
        },
      } as IErrorResponse)
    }

    // ctx.request.jwt = accessToken

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
