import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import { IErrorResponse } from '../interfaces/responses.js'

export default class InvalidCredentialsException extends Exception {
  static status = 400
  static code = 'E_INVALID_CREDENTIALS'
  static message = 'Invalid email or password'

  async handle(error: this, ctx: HttpContext) {
    const responseBody: IErrorResponse = {
      error: {
        code: error.code!,
        message: error.message,
      },
    }

    return ctx.response.badRequest(responseBody)
  }
}
