export interface IUserCreate {
  name?: string
  email: string
  password: string
  isActive?: boolean
}

export interface IUserRetrieve {
  id: number
  name: string
  email: string
  isActive: boolean
}

export interface IUserUpdate {
  name?: string
  email?: string
  password?: string
  isActive?: boolean
}
