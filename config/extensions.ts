import { IJwtUser } from '../app/interfaces/jwt.js'

// When accessing a route protected by "auth" middleware, the user will be available
declare module '@adonisjs/core/http' {
  interface Request {
    /** Logged in user */
    user: IJwtUser
  }
}
