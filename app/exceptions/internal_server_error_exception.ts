import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

import { IErrorResponse } from '../interfaces/responses.js'

export default class InternalServerErrorException extends Exception {
  static status = 500
  static code = 'E_INTERNAL_SERVER_ERROR'
  static message = 'Internal server error'

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
