import Transaction from "#models/transaction";
import { ITransactionCreate } from "../interfaces/transactions.js";

export class TransactionService {
  async findByUserId(userId: number) {
    const transactions = await Transaction.query()
      .where('userId', userId)
      .preload('category')
      .preload('creator')
      .exec()

    const allTransactions = transactions.map((item) => item.toResponse())
    return allTransactions
  }

  async create(payload: ITransactionCreate) {
    const created = await Transaction.create(payload)
    return created.toResponse()
  }
}
