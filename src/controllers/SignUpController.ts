import {httpRequest,httpResponse} from '../protocols/http'
import {badRequest} from '../helpers/badRequest'
import { MissingFieldsError } from '../errors/MissingFieldsError'
export class SignUpController {
  handle (httpRequest: httpRequest): any {
    const requiredFields = ['name','email','password','passwordConfirmation']
    for(const field of requiredFields){
      if (!httpRequest.body[field]){
        return badRequest(new MissingFieldsError(field))
      }
    }
  }
}
