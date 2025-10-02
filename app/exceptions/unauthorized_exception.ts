import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import { IErrorResponse } from '../interfaces/responses.js'

export default class UnauthorizedException extends Exception {
  static status = 401
  static code = 'E_UNAUTHORIZED'
  static message = 'Unauthorized access'

  async handle(error: this, ctx: HttpContext) {
    const responseBody: IErrorResponse = {
      error: {
        code: error.code!,
        message: error.message,
      },
    }

    return ctx.response.unauthorized(responseBody)
  }
}
