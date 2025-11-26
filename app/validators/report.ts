import vine from '@vinejs/vine'

export const reportsSummaryValidator = vine.compile(
  vine.object({
    start_date: vine.date({ formats: ['YYYY-MM-DD', 'DD-MM-YYYY'] }).optional().requiredIfAnyExists(['end_date']),
    end_date: vine.date({ formats: ['YYYY-MM-DD', 'DD-MM-YYYY'] }).optional().requiredIfAnyExists(['start_date']),
  })
)
