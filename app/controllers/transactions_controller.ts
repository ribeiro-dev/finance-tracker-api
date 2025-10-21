import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import BadRequestException from '#exceptions/bad_request_exception'

import { TransactionService } from '#services/transaction_service'
import { createTransactionValidator, updateTransactionValidator } from '#validators/transaction'
import CategoryService from '#services/category_service'

import { ISuccessResponse } from '../interfaces/responses.js'
import { ITransactionCreate, ITransactionUpdate } from '../interfaces/transactions.js'

@inject()
export default class TransactionsController {
  private transactionService: TransactionService
  private categoryService: CategoryService

  constructor(transactionService: TransactionService, categoryService: CategoryService) {
    this.transactionService = transactionService
    this.categoryService = categoryService
  }

  async index({ request, response }: HttpContext) {
    const userId = request.user.id

    try {
      const transactions = await this.transactionService.findByUserId(userId)
      return response.ok({ data: transactions } as ISuccessResponse)

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }

  async store({ request, response }: HttpContext) {
    const userId = request.user.id
    const payload = await request.validateUsing(createTransactionValidator)

    const categoryBelongsToUser = this.categoryService.userIsOwner(payload.categoryId, userId)
    if (!categoryBelongsToUser) {
      throw new BadRequestException('Category is not valid')
    }

    try {
      const created = await this.transactionService.create({
        ...payload,
        userId,
      } as ITransactionCreate)
      return response.ok({ data: created } as ISuccessResponse)

    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException()
    }
  }

  async update({ request, response }: HttpContext) {
    const { transactionId } = request.params()
    const userId = request.user.id

    const payload = await request.validateUsing(updateTransactionValidator)

    const transaction = await this.transactionService.findById(transactionId)
    if (!transaction) {
      throw new BadRequestException('Transaction not found')
    }

    const categoryId = payload.categoryId ?? transaction.category.id
    const categoryBelongsToUser = await this.categoryService.userIsOwner(categoryId, userId)
    if (!categoryBelongsToUser) {
      throw new BadRequestException('Invalid category id')
    }

    const userIsOwner = transaction.creator.id == userId
    if (!userIsOwner) {
      throw new BadRequestException('User is not owner of the category')
    }

    try {
      const updated = await this.transactionService.update(payload as ITransactionUpdate, transactionId)
      if (!updated)
        throw new Error()

      return response.ok({ data: updated } as ISuccessResponse)

    } catch (error) {
      console.error(error)

      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new BadRequestException('Transaction not found')
      }

      throw new InternalServerErrorException('Error updating transaction')
    }
  }
}
