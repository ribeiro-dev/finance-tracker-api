import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().toLowerCase().maxLength(100),
    password: vine.string(),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).optional(),
    email: vine.string().trim().email().toLowerCase().maxLength(100),
    password: vine.string().minLength(6),
  })
)
