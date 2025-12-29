import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

import { OAuth2Client } from 'google-auth-library'
import { UserService } from './user_service.js'
import { inject } from '@adonisjs/core'

import InternalServerErrorException from '#exceptions/internal_server_error_exception'

const NEW_USER_DEFAULT_CATEGORIES = [
  { name: 'Contas' },
  { name: 'Lazer' },
  { name: 'Presente' },
  { name: 'Transporte' },
]

@inject()
export class AuthService {
  // automatically declares the class variable(s)
  constructor(private userService: UserService) {}

  async verifyCredentials(email: string, plainPassword: string) {
    const user = await User.findByOrFail({ email })
    const validPassword = await hash.verify(user.password, plainPassword)

    return validPassword ? user : false
  }

  async verifyGoogleCredentials(code: string) {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env
    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, 'postmessage')

    const data = await googleClient.getToken(code)
    const idToken = data.tokens.id_token
    if (!data || !idToken) {
      console.error("Couldn't get Google token")
      throw new InternalServerErrorException("Couldn't get Google token")
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload?.email) {
      console.error('Google payload missing email')
      throw new InternalServerErrorException('Google payload missing email')
    }

    let user = await this.userService.findByEmail(payload.email)
    if (!user) {
      user = await this.register(payload.email, await hash.make(crypto.randomUUID()), payload.name)
    }

    return user
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
