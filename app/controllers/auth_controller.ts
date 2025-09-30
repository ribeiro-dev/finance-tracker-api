import { AuthService } from '#services/auth_service'
import { loginValidator } from '#validators/auth'

import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { IErrorResponse, ISuccessResponse } from '../interfaces/responses.js'
import JwtUtil from '../utils/jwt.js'

@inject()
export default class AuthController {
  private authService: AuthService

  constructor(authService: AuthService) {
    this.authService = authService
  }

  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    const verifiedUser = await this.authService.verifyCredentials(payload.email, payload.password)
    if (!verifiedUser) {
      const responseBody: IErrorResponse = {
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      }
      return response.badRequest(responseBody)
    }

    const token = JwtUtil.generateAccessToken(verifiedUser)
    const responseBody = {
      verified: verifiedUser,
      data: {
        accessToken: token.accessToken,
        expiresAt: token.expiresAt,
      },
    } as ISuccessResponse

    return response.ok(responseBody)
  }
}
