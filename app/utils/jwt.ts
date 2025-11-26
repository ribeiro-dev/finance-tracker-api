import env from '#start/env'
import jwt from 'jsonwebtoken'

import { IJwtPayload, IJwtUser } from '../interfaces/jwt.js'

class JwtUtil {
  private static expirationTime = 3600

  static generateAccessToken(payload: any) {
    const token = jwt.sign(
      {
        payload,
      },
      env.get('APP_KEY'),
      { expiresIn: '1 hour' }
    )

    return {
      accessToken: token,
      expiresAt: new Date().getTime() + JwtUtil.expirationTime,
    }
  }

  static validate(accessToken: string): IJwtUser | false {
    try {
      const { payload } = jwt.verify(accessToken, env.get('APP_KEY')) as IJwtPayload
      return payload
    } catch (error) {
      console.log(error)
      return false
    }
  }
}

export default JwtUtil
