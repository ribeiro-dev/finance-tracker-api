import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'
import { IErrorResponse } from '../interfaces/responses.js'

export default class NotFoundException extends Exception {
  static status = 404
  static code = 'E_NOT_FOUND'
  static message = 'Resource not found'

  async handle(error: this, ctx: HttpContext) {
    const responseBody: IErrorResponse = {
      error: {
        code: error.code!,
        message: error.message,
      },
    }

    return ctx.response.notFound(responseBody)
  }
}
