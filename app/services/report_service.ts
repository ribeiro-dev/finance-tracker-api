import Transaction from '#models/transaction'
import { TransactionType } from '../enums/transaction.js'
import { IReportSummaryRetrieve } from '../interfaces/reports.js'

export default class ReportService {
  async summary(userId: number, start_date: string, end_date: string) {
    let query = Transaction.query()
      .where('user_id', userId)
      .whereBetween('date', [start_date, end_date])

    const [income] = await query.clone().where('type', TransactionType.INCOME).sum('amount as total')
    const [expense] = await query.clone().where('type', TransactionType.EXPENSE).sum('amount as total')

    const incomeTotal = income.$extras.total ?? 0
    const expenseTotal = expense.$extras.total ?? 0

    return {
      period: { start: start_date, end: end_date },
      income: incomeTotal,
      expenses: expenseTotal,
      balance: incomeTotal - expenseTotal,
    } as IReportSummaryRetrieve
  }
}
