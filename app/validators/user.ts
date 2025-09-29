import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(50).optional(),
    email: vine.string().trim().email().toLowerCase().maxLength(100),
    password: vine.string(),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(50).optional(),
    email: vine.string().trim().email().toLowerCase().maxLength(100).optional(),
    password: vine.string().optional(),
    isActive: vine.boolean().optional(),
  })
)
