import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

import { IErrorResponse } from '../interfaces/responses.js'

export default class BadRequestException extends Exception {
  static status = 400
  static code = 'E_BAD_REQUEST'
  static message = 'Invalid request'

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
