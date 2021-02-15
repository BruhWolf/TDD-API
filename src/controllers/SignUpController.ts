import {httpRequest,httpResponse} from '../protocols/http'
import {badRequest} from '../helpers/badRequest'
import { MissingFieldsError } from '../errors/MissingFieldsError'
export class SignUpController {

  handle (httpRequest: httpRequest): httpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingFieldsError('name'))
    }
    if (!httpRequest.body.email) {
      return badRequest(new MissingFieldsError('email'))
    }
    return{
      statusCode: 200,
      body: 'bem vindo'
    }

  }
}