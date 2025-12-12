import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import User from './user.js'
import Category from './category.js'

import { ITransactionRetrieve } from '../interfaces/transactions.js'
import { TransactionType } from '../enums/transaction.js'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column({
    consume: (value) => Number(value), // Postgres returns as string
  })
  declare amount: number

  @column.dateTime()
  declare date: DateTime

  @column()
  declare description: string | null

  @column()
  declare type: TransactionType

  @column()
  declare userId: number

  @column()
  declare categoryId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships
  @belongsTo(() => User)
  declare creator: BelongsTo<typeof User>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  // Methods
  public toResponse(): ITransactionRetrieve {
    return {
      id: this.id,
      title: this.title,
      amount: this.amount,
      date: this.date,
      description: this.description,
      type: this.type,
      creator: this.creator,
      category: this.category,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
