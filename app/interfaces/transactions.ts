import Category from "#models/category"
import User from "#models/user"
import { DateTime } from "luxon"
import { TransactionType } from "../enums/transaction.js"

export interface ITransactionRetrieve {
    id: number
    title: string
    amount: number
    date: DateTime
    description: string | null
    type: TransactionType
    creator: User
    category: Category
    createdAt: DateTime
    updatedAt: DateTime
}
