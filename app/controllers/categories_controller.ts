import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import CategoriesService from '#services/category_service'
import { createCategoryValidator, updateCategoryValidator } from '#validators/category'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { ISuccessResponse } from '../interfaces/responses.js'
import BadRequestException from '#exceptions/bad_request_exception'

@inject()
export default class CategoriesController {
  private categoryService: CategoriesService

  constructor(categoriesService: CategoriesService) {
    this.categoryService = categoriesService
  }

  async index({ request, response }: HttpContext) {
    const userId = request.user.id
    const categories = await this.categoryService.findByUserId(userId)

    const responseBody: ISuccessResponse = {
      data: categories,
    }

    return response.ok(responseBody)
  }

  async store({ request, response }: HttpContext) {
    const userId = request.user.id

    try {
      const payload = await request.validateUsing(createCategoryValidator)
      const created = await this.categoryService.create({ ...payload, userId })

      const responseBody: ISuccessResponse = {
        data: created,
      }
      return response.created(responseBody)
    } catch (error) {
      console.log(error)

      throw new InternalServerErrorException()
    }
  }

  async update({ request, response }: HttpContext) {
    const { categoryId } = request.params()
    const userId = request.user.id
    const payload = await request.validateUsing(updateCategoryValidator)

    const categoryExists = await this.categoryService.userIsOwner(categoryId, userId)
    if (!categoryExists) {
      throw new BadRequestException('Categoria nao encontrada')
    }

    try {
      const updated = await this.categoryService.update(payload, categoryId, userId)
      if (!updated)
        throw new Error()

      const responseBody: ISuccessResponse = {
        data: updated
      }

      return response.ok(responseBody)
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar categoria')
    }

  }

  async delete({ request, response }: HttpContext) {
    const { categoryId } = request.params()
    const userId = request.user.id

    const categoryExists = await this.categoryService.userIsOwner(categoryId, userId)
    if (!categoryExists) {
      throw new BadRequestException('Categoria nao encontrada')
    }

    try {
      await this.categoryService.delete(categoryId)
      return response.noContent()
    } catch (error) {
      throw new InternalServerErrorException('Erro ao deletar categoria')
    }

  }
}
