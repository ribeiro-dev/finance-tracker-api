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

import AutoSwagger from "adonis-autoswagger";
import swagger from "#config/swagger";

router.get('/health', async () => {
  return {
    hello: 'world',
  }
})

// returns swagger in YAML
router.get("/swagger", async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger);
});

// Renders Swagger-UI and passes YAML-output of /swagger
router.get("/docs", async () => {
  return AutoSwagger.default.ui("/swagger", swagger);
  // return AutoSwagger.default.scalar("/swagger"); to use Scalar instead. If you want, you can pass proxy url as second argument here.
  // return AutoSwagger.default.rapidoc("/swagger", "view"); to use RapiDoc instead (pass "view" default, or "read" to change the render-style)
});

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
      router.put('/:transactionId', [TransactionsController, 'update'])
      router.delete('/:transactionId', [TransactionsController, 'destroy'])
    })
    .prefix('/transactions')
    .use(middleware.auth())
  })
  .prefix('/api')
