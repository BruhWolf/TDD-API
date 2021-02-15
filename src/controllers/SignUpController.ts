import {httpRequest,httpResponse} from '../protocols/http'
import {badRequest} from '../helpers/badRequest'
import { MissingFieldsError } from '../errors/MissingFieldsError'
export class SignUpController {
  handle (httpRequest: httpRequest): httpResponse {
    const requiredFields = ['name','email','password','passwordConfirmation']
    requiredFields.map( field => {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingFieldsError(field))
      }
    })
    return{
      statusCode: 200,
      body: 'bem vindo'
    }
  }
}
