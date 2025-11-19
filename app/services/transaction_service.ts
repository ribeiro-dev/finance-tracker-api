import Transaction from '#models/transaction'
import { ITransactionCreate, ITransactionUpdate } from '../interfaces/transactions.js'

export class TransactionService {
  async findByUserId(userId: number) {
    const transactions = await Transaction.query()
      .where('userId', userId)
      .orderBy('date', 'desc')
      .preload('category')
      .preload('creator')
      .exec()

    const allTransactions = transactions.map((item) => item.toResponse())
    return allTransactions
  }

  async findById(id: number) {
    const transaction = await Transaction.query()
      .where('id', id)
      .orderBy('date', 'desc')
      .preload('category')
      .preload('creator')
      .first()
    if (!transaction)
      return null

    return transaction.toResponse()
  }

  async create(payload: ITransactionCreate) {
    const created = await Transaction.create(payload)
    return created.toResponse()
  }

  async update(payload: ITransactionUpdate, transactionId: number) {
    const transaction = await Transaction.find(transactionId)
    if (!transaction) {
      return null
    }

    transaction.merge(payload)
    await transaction.save()
    return transaction.toResponse()
  }

  async delete(transactionId: number) {
    const transaction = await Transaction.find(transactionId)
    if (!transaction)
      return false

    await transaction.delete()
    return transaction
  }
}
