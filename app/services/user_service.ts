import User from '#models/user'
import { IUserCreate, IUserRetrieve, IUserUpdate } from '../interfaces/user.js'

export class UserService {
  async findAll(): Promise<IUserRetrieve[]> {
    const users = await User.query()
      .select('*')
      .preload('categories')
      .exec()

    const usersRetrieve = users.map((user) => {
      const { id, name, email, isActive, categories } = user
      return {
        id,
        name,
        email,
        isActive,
        categories,
      } as IUserRetrieve
    })

    return usersRetrieve
  }

  async findById(userId: number): Promise<IUserRetrieve | null> {
    const user = await User.find(userId)

    if (!user) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
    } as IUserRetrieve
  }

  async findByEmail(email: string): Promise<IUserRetrieve | null> {
    const user = await User.findBy({ email })
    return user ? user.toResponse() : null
  }

  async create(payload: IUserCreate): Promise<IUserRetrieve> {
    const user = await User.create(payload)
    const created = {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
    } as IUserRetrieve

    return created
  }

  async update(userId: number, payload: IUserUpdate) {
    const user = await User.findByOrFail({ id: userId })

    user.merge(payload)
    await user.save()
  }

  async delete(userId: number) {
    const user = await User.findByOrFail({ id: userId })
    await user.delete()
  }
}
