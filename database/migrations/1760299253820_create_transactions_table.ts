import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 100).notNullable()
      table.decimal('amount', 10, 2).notNullable()
      table.dateTime('date').notNullable()
      table.text('description')
      table.enum('type', ['INCOME', 'EXPENSE'], {
        useNative: true,
        enumName: 'transaction_type'
      })
      table.integer('user_id').notNullable()
      table.integer('category_id').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Relationships
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.foreign('category_id').references('categories.id').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
