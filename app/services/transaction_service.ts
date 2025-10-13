import Transaction from "#models/transaction";

export class TransactionService {
  async findByUserId(userId: number) {
    const transactions = await Transaction.query()
      .where('userId', userId)
      .preload('category')
      .preload('creator')
      .exec()

    const allTransactions = transactions.map(item => item.toResponse())
    return allTransactions
  }
}
