import { AuthService } from '#services/auth_service'
import { UserService } from '#services/user_service'

import { loginValidator, registerValidator } from '#validators/auth'
import { googleLoginValidator } from '#validators/google_login'
import InvalidCredentialsException from '#exceptions/invalid_credentials_exception'
import ConflictException from '#exceptions/conflict_exception'

import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import { ISuccessResponse } from '../interfaces/responses.js'
import JwtUtil from '../utils/jwt.js'

@inject()
export default class AuthController {
  private authService: AuthService
  private userService: UserService

  constructor(authService: AuthService, userService: UserService) {
    this.authService = authService
    this.userService = userService
  }

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

  async loginWithGoogle({ request, response }: HttpContext) {
    const { code } = await request.validateUsing(googleLoginValidator)

    const googleUser = await this.authService.verifyGoogleCredentials(code)
    if (!googleUser) throw new InvalidCredentialsException()

    const token = JwtUtil.generateAccessToken(googleUser)
    return response.ok({
      data: {
        accessToken: token.accessToken,
        expiresAt: token.expiresAt,
      },
    } as ISuccessResponse)
  }

  async register({ request, response }: HttpContext) {
    const { email, password, name } = await request.validateUsing(registerValidator)
    const emailExists = await this.userService.findByEmail(email)
    if (emailExists) {
      throw new ConflictException('Email already exists')
    }

    const created = await this.authService.register(email, password, name)
    const token = JwtUtil.generateAccessToken(created)

    return response.created({
      message: 'User created successfully',
      data: created,
      token: token,
    } as ISuccessResponse)
  }
}
