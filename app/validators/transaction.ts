import vine from '@vinejs/vine'
import { TransactionType } from '../enums/transaction.js'
import { DateTime } from 'luxon'

const formatDate = (date: Date) => DateTime.fromJSDate(date).toSQLDate()

export const getTransactionsValidator = vine.compile(
  vine.object({
    start_date: vine
      .date({ formats: ['YYYY-MM-DD', 'DD-MM-YYYY'] })
      .optional()
      .requiredIfAnyExists(['end_date'])
      .transform((value) => formatDate(value)),
    end_date: vine
      .date({ formats: ['YYYY-MM-DD', 'DD-MM-YYYY'] })
      .optional()
      .requiredIfAnyExists(['start_date'])
      .transform((value) => formatDate(value)),
  })
)

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

export const updateTransactionValidator = vine.compile(
  vine.object({
    title: vine.string().trim().maxLength(100).optional(),
    amount: vine.number().positive().optional(),
    date: vine
      .string()
      .trim()
      .transform((value) => DateTime.fromJSDate(new Date(value)))
      .optional(),
    description: vine.string().trim().nullable().optional(),
    type: vine.enum(TransactionType).optional(),
    categoryId: vine.number().positive().exists({
      table: 'categories',
      column: 'id',
    }).optional(),
  })
)
