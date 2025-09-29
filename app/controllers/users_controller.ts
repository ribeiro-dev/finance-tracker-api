import { UserService } from '#services/user_service'
import { createUserValidator, updateUserValidator } from '#validators/user'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { IUserUpdate } from '../interfaces/user.js'
import { IErrorResponse, ISuccessResponse } from '../interfaces/responses.js'

@inject()
export default class UsersController {
  private userService: UserService

  constructor(userService: UserService) {
    this.userService = userService
  }

  async index({ response }: HttpContext) {
    const users = await this.userService.findAll()
    const responseBody: ISuccessResponse = {
      data: users,
    }

    return response.ok(responseBody)
  }

  async store({ request, response }: HttpContext) {
    // const data = request.all()

    try {
      const payload = await request.validateUsing(createUserValidator)
      const created = await this.userService.create(payload)
      const responseBody: ISuccessResponse = {
        data: created,
      }

      return response.created(responseBody)
    } catch (error) {
      console.error(error)

      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        //! Change validation later
        const responseBody: IErrorResponse = {
          error: {
            code: 'UNIQUE_CONSTRAINT_VIOLATION',
            message: 'Email already exists',
          },
        }
        return response.conflict(responseBody)
      }

      const responseBody: IErrorResponse = {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error creating user',
        },
      }
      return response.internalServerError(responseBody)
    }
  }

  async update({ request, params, response }: HttpContext) {
    const { userId } = params

    try {
      const payload = await request.validateUsing(updateUserValidator, { meta: { userId } })
      const updateData = {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        isActive: payload.isActive,
      } as IUserUpdate

      await this.userService.update(userId, updateData)
      return response.noContent()
    } catch (error) {
      console.error(error)

      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        //! Change validation code later
        const responseBody: IErrorResponse = {
          error: {
            code: 'UNIQUE_CONSTRAINT_VIOLATION',
            message: 'Email already exists',
          },
        }
        return response.conflict(responseBody)
      }

      const responseBody: IErrorResponse = {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error creating user',
        },
      }
      return response.internalServerError(responseBody)
    }
  }

  async destroy({ params, response }: HttpContext) {
    const { userId } = params

    try {
      await this.userService.delete(userId)
      return response.noContent()
    } catch (error) {
      const responseBody: IErrorResponse = {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error creating user',
        },
      }
      return response.internalServerError(responseBody)
    }
  }
}
