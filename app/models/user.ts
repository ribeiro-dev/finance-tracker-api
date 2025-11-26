import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import hash from '@adonisjs/core/services/hash'

import Category from './category.js'
import Transaction from './transaction.js'
import { IUserRetrieve } from '../interfaces/user.js'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Hooks
  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  // Relationships
  @hasMany(() => Category)
  declare categories: HasMany<typeof Category>

  @hasMany(() => Transaction)
  declare transactions: HasMany<typeof Transaction>

  // Methods
  public toResponse(): IUserRetrieve {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      isActive: this.isActive,
    }
  }
}
