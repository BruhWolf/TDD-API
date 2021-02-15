import { HttpResponse } from "../protocols/http";
import { InternalServerError } from '../errors/InternalServerError'

export const badRequest = (error: any): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new InternalServerError()
})