export interface IJwtUser {
  id: number
  name: string
  email: string
}

export interface IJwtPayload {
  payload: IJwtUser
  iat: number
  exp: number
}
