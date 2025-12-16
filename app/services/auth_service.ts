import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

const NEW_USER_DEFAULT_CATEGORIES = [
  { name: 'Contas' },
  { name: 'Lazer' },
  { name: 'Presente' },
  { name: 'Transporte' },
]

export class AuthService {
  async verifyCredentials(email: string, plainPassword: string) {
    const user = await User.findByOrFail({ email })
    const validPassword = await hash.verify(user.password, plainPassword)

    return validPassword ? user : false
  }

  async register(email: string, plainPassword: string, name: string | undefined) {
    const createdUser = await db.transaction(async (trx) => {
      const user = await User.create({ email, password: plainPassword, name }, { client: trx })
      await user.related('categories').createMany(NEW_USER_DEFAULT_CATEGORIES)

      return user
    })

    return createdUser.toResponse()
  }
}
