import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const isProduction = process.env.NODE_ENV === 'production'

const dbConfig = defineConfig({
  connection: isProduction ? 'postgres' : 'sqlite',
  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: app.tmpPath('db.sqlite3'),
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },

    postgres: {
      client: 'pg',
      connection: {
        connectionString:
          'postgresql://postgres.xlhqaqzxznvdvfhsnjry:UmaSenhaMuitoFoda@aws-1-sa-east-1.pooler.supabase.com:5432/postgres',
        ssl: {
          rejectUnauthorized: false,
        },
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
