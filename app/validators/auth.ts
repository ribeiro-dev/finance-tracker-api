import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().toLowerCase().maxLength(100),
    password: vine.string(),
  })
)
