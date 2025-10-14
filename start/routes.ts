/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')
const CategoriesController = () => import('#controllers/categories_controller')
const TransactionsController = () => import('#controllers/transactions_controller')

router.get('/health', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('/login', [AuthController, 'login'])
      })
      .prefix('/auth')

    router
      .group(() => {
        router.get('/', [UsersController, 'index'])
        router.post('/', [UsersController, 'store'])
        router.put('/:userId', [UsersController, 'update'])
        router.delete('/:userId', [UsersController, 'destroy'])
      })
      .prefix('/users')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [CategoriesController, 'index'])
        router.post('/', [CategoriesController, 'store'])
        router.put('/:categoryId', [CategoriesController, 'update'])
        router.delete('/:categoryId', [CategoriesController, 'delete'])
      })
      .prefix('/categories')
      .use(middleware.auth())

    router.group(() => {
      router.get('/', [TransactionsController, 'index'])
      router.post('/', [TransactionsController, 'store'])
    })
    .prefix('/transactions')
    .use(middleware.auth())
  })
  .prefix('/api')
