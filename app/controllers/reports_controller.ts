import ReportService from '#services/report_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { ISuccessResponse } from '../interfaces/responses.js'
import { DateTime } from 'luxon'
import { reportsSummaryValidator } from '#validators/report'

@inject()
export default class ReportsController {
  private reportService: ReportService

  constructor(reportService: ReportService) {
    this.reportService = reportService
  }

  public async summary({ request, response }: HttpContext) {
    const userId = request.user.id

    await request.validateUsing(reportsSummaryValidator)

    let { start_date, end_date } = request.qs()

    const datesNotDefined = !(start_date | end_date)
    if (datesNotDefined) {
      const today = DateTime.now()
      start_date = today.startOf('month').toFormat('yyyy-MM-dd')
      end_date = today.endOf('month').toFormat('yyyy-MM-dd')
    }

    const data = await this.reportService.summary(userId, start_date, end_date)
    return response.ok({ data } as ISuccessResponse)
  }
}
