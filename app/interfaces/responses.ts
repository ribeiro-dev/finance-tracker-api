export interface ISuccessResponse {
  data: Record<string, any> | Array<any>
}

export interface IErrorResponse {
  error: {
    code: string
    message: string
  }
}
