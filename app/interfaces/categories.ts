import { DateTime } from 'luxon'

export interface ICategoryRetrieve {
  id: number
  name: string
  createdAt: DateTime
  updatedAt: DateTime
}

export interface ICategoryCreate {
  name: string
  userId: number
}

export interface ICategoryUpdate {
  name: string
}
