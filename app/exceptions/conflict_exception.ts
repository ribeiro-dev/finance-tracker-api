import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

import { IErrorResponse } from '../interfaces/responses.js'

export default class ConflictException extends Exception {
  static status = 409
  static code = 'E_CONFLICT'
  static message = 'A conflict occurred'

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
