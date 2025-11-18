import vine from '@vinejs/vine'
import { TransactionType } from '../enums/transaction.js'
import { setTimezone } from '../utils/date.js'

export const createTransactionValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(100),
    amount: vine.number().positive(),
    date: vine
      .string() // date doesn't accept datetime
      .trim()
      .transform((value) => setTimezone(new Date(value))),
    description: vine.string().trim().optional(),
    type: vine.enum(TransactionType),
    categoryId: vine.number().positive().exists({
      table: 'categories',
      column: 'id',
    }),
  })
)

export const updateTransactionValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(100).optional(),
    amount: vine.number().positive().optional(),
    date: vine
      .string() // date doesn't accept datetime
      .trim()
      .transform((value) => setTimezone(new Date(value)))
      .optional(),
    description: vine.string().trim().nullable().optional(),
    type: vine.enum(TransactionType).optional(),
    categoryId: vine.number().positive().exists({
      table: 'categories',
      column: 'id',
    }).optional(),
  })
)
