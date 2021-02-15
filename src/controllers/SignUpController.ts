import {HttpRequest,HttpResponse} from '../protocols/http'
import {Controller} from '../protocols/controller'
import {badRequest} from '../helpers/badRequest'
import { MissingFieldsError } from '../errors/MissingFieldsError'
import { PasswordConfirmationError } from '../errors/PasswordConfirmationError'
export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name','email','password','passwordConfirmation']
    for(const field of requiredFields){
      if (!httpRequest.body[field]){
        return badRequest(new MissingFieldsError(field))
      }
    }
    if (httpRequest.body.password !== httpRequest.body.passwordConfirmation){
      return badRequest( new PasswordConfirmationError()
    }
  }
}
