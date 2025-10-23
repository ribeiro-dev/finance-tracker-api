import { AuthService } from '#services/auth_service'
import { loginValidator } from '#validators/auth'
import InvalidCredentialsException from '#exceptions/invalid_credentials_exception'

import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { ISuccessResponse } from '../interfaces/responses.js'
import JwtUtil from '../utils/jwt.js'

@inject()
export default class AuthController {
  private authService: AuthService

  constructor(authService: AuthService) {
    this.authService = authService
  }

  /**
   * @login
   * @requestBody { "email": "your@email.com", "password": "nicePasswordHere" }
   * @responseBody <200>  - {"data": { "accessToken": "yourToken", "expiresAt": 123456789}} - Will return your data inside and object. Containing your token and expiration
   */
  async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(loginValidator)

    const verifiedUser = await this.authService.verifyCredentials(payload.email, payload.password)
    if (!verifiedUser) throw new InvalidCredentialsException()

    const token = JwtUtil.generateAccessToken(verifiedUser)
    const responseBody = {
      data: {
        accessToken: token.accessToken,
        expiresAt: token.expiresAt,
      },
    } as ISuccessResponse

    return response.ok(responseBody)
  }
}
