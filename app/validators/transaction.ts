import vine from '@vinejs/vine'
import { TransactionType } from '../enums/transaction.js'
import { DateTime } from 'luxon'

export const createTransactionValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(100),
    amount: vine.number().positive(),
    date: vine
      .string()
      .trim()
      .transform((value) => DateTime.fromJSDate(new Date(value))),
    description: vine.string().trim().optional(),
    type: vine.enum(TransactionType),
    categoryId: vine.number().positive().exists({
      table: 'categories',
      column: 'id',
    }),
  })
)
