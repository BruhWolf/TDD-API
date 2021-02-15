import { httpResponse } from "../protocols/http";
export const badRequest = (error: any): httpResponse => ({
  statusCode: 400,
  body: error
})