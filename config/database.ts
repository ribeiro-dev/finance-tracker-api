import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, NODE_ENV } = process.env
const isProduction = NODE_ENV === 'production'

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
        connectionString: `postgresql://${DB_USER}.${DB_HOST}:${DB_PASSWORD}@aws-1-sa-east-1.pooler.supabase.com:${DB_PORT}/${DB_DATABASE}`,
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
