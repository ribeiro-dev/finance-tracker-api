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
  })
  .prefix('/api')
