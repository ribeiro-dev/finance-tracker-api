import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export class AuthService {
  async verifyCredentials(email: string, plainPassword: string) {
    const user = await User.findByOrFail({ email })
    const validPassword = await hash.verify(user.password, plainPassword)

    return validPassword ? user : false
  }

  async register(email: string, plainPassword: string, name: string | undefined) {
    const user = await User.create({ email, password: plainPassword, name })
    return user.toResponse()
  }
}
