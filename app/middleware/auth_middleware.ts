import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

import JwtUtil from '../utils/jwt.js'

import UnauthorizedException from '#exceptions/unauthorized_exception'
import InvalidTokenException from '#exceptions/invalid_token_exception'

export default class AuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const authorization = ctx.request.header('Authorization', null)
    if (!authorization) throw new UnauthorizedException()

    const accessToken = authorization.split('Bearer').pop()?.trim()
    if (!accessToken) throw new InvalidTokenException()

    const data = JwtUtil.validate(accessToken)
    if (!data) throw new InvalidTokenException()

    // ctx.request.jwt = accessToken

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
