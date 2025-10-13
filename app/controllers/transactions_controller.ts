import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import { TransactionService } from '#services/transaction_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { ISuccessResponse } from '../interfaces/responses.js'

@inject()
export default class TransactionsController {
  private transactionService: TransactionService

  constructor(transactionService: TransactionService) {
    this.transactionService = transactionService
  }

  async index({ request, response }: HttpContext) {
    const userId = request.user.id

    try {
      const transactions = await this.transactionService.findByUserId(userId)
      const responseBody: ISuccessResponse = {
        data: transactions
      }

      return response.ok(responseBody)

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }

}
