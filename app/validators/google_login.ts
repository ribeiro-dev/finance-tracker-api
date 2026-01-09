import vine from '@vinejs/vine'

export const googleLoginValidator = vine.compile(
  vine.object({
    code: vine.string().trim(),
  })
)
