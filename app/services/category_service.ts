import Category from '#models/category'
import { ICategoryCreate, ICategoryRetrieve, ICategoryUpdate } from '../interfaces/categories.js'

export default class CategoryService {
  async findAll(): Promise<ICategoryRetrieve[]> {
    const categories = await Category.query().select().orderBy('name').exec()
    const allCategories = categories.map((item) => item.toResponse())

    return allCategories
  }

  async findByUserId(userId: number): Promise<ICategoryRetrieve[]> {
    const categories = await Category.query().where('user_id', userId).orderBy('name').exec()
    const allCategories = categories.map((item) => item.toResponse())

    return allCategories
  }

  async create(payload: ICategoryCreate): Promise<ICategoryRetrieve> {
    const category = await Category.create(payload)
    const created = category.toResponse()

    return created
  }

  async update(payload: ICategoryUpdate, categoryId: number, userId: number) {
    const category = await Category.query().where('id', categoryId).where('user_id', userId).first()
    if (!category) {
      return false
    }

    category.merge(payload)
    await category.save()
    const updatedCategory = category.toResponse()

    return updatedCategory
  }

  async userIsOwner(categoryId: number, userId: number): Promise<boolean> {
    const category = await Category
      .query()
      .where('id', categoryId)
      .where('user_id', userId)
      .exec()

    return category.length > 0
  }

  async delete(categoryId: number) {
    const category = await Category.find(categoryId)
    await category?.delete()

    return category
  }
}
