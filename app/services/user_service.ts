import User from '#models/user'
import { IUserCreate, IUserRetrieve, IUserUpdate } from '../interfaces/user.js'

export class UserService {
  async findAll(): Promise<IUserRetrieve[]> {
    const users = await User.query().select('*').exec()

    const usersRetrieve = users.map((user) => {
      const { id, name, email, isActive } = user
      return {
        id,
        name,
        email,
        isActive,
      } as IUserRetrieve
    })

    return usersRetrieve
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
