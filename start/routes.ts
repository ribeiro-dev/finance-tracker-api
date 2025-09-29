/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const UsersController = () => import('#controllers/users_controller')
import router from '@adonisjs/core/services/router'
// import { middleware } from './kernel.js'

router.get('/health', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.get('/', [UsersController, 'index'])
    router.post('/', [UsersController, 'store'])
    router.put('/:userId', [UsersController, 'update'])
    router.delete('/:userId', [UsersController, 'destroy'])
  })
  .prefix('/users')
// .use(middleware.auth())
