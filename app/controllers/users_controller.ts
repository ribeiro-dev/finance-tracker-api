import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

import { UserService } from '#services/user_service'
import { createUserValidator, updateUserValidator } from '#validators/user'

import { IUserUpdate } from '../interfaces/user.js'
import { ISuccessResponse } from '../interfaces/responses.js'

import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import BadRequestException from '#exceptions/bad_request_exception'
import ConflictException from '#exceptions/conflict_exception'
import NotFoundException from '#exceptions/not_found_exception'

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
      payload.password = await hash.make(payload.password)

      const created = await this.userService.create(payload)
      const responseBody: ISuccessResponse = {
        data: created,
      }

      return response.created(responseBody)
    } catch (error) {
      console.error(error)

      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        //! Change validation code later
        throw new ConflictException('Email already exists', { code: 'E_UNIQUE_CONSTRAINT_VIOLATION' })
      }

      throw new InternalServerErrorException()
    }
  }

  async update({ request, params, response }: HttpContext) {
    const { userId } = params

    try {
      const payload = await request.validateUsing(updateUserValidator)
      const user = this.userService.findById(userId)

      if (!user) throw new BadRequestException('User not found', { code: 'E_ROW_NOT_FOUND' })

      const updateData = {
        name: payload.name,
        isActive: payload.isActive,
      } as IUserUpdate

      await this.userService.update(userId, updateData)
      return response.noContent()
    } catch (error) {
      console.error(error)

      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        //! Change validation code later
        throw new ConflictException('Email already exists', { code: 'E_UNIQUE_CONSTRAINT_VIOLATION' })
      }

      if (error.code === 'E_ROW_NOT_FOUND') {
        throw new NotFoundException('User not found')
      }

      throw new InternalServerErrorException('Error creating user')
    }
  }

  async destroy({ params, response }: HttpContext) {
    const { userId } = params

    try {
      await this.userService.delete(userId)
      return response.noContent()
    } catch (error) {
      console.error(error)
      throw new InternalServerErrorException('Error deleting user')
    }
  }
}
