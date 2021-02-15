import {HttpRequest,HttpResponse} from '../protocols/http'
import {Controller} from '../protocols/controller'
import {badRequest,serverError} from '../helpers/httpResponse.helper'
import { MissingFieldsError, PasswordConfirmationError } from '../errors'
import { EmailValidator } from '../protocols/emailValidator'
import { InvalidFieldsError } from '../errors/InvalidFieldsError'


export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator){}
  handle (httpRequest: HttpRequest): HttpResponse {
    try{
      const requiredFields = ['name','email','password','passwordConfirmation']
      for(const field of requiredFields){
        if (!httpRequest.body[field]){
          return badRequest(new MissingFieldsError(field))
        }
      }
      if (httpRequest.body.password !== httpRequest.body.passwordConfirmation){
        return badRequest( new PasswordConfirmationError())
      }
      if(!this.emailValidator.isValid(httpRequest.body.email)){
        return badRequest( new InvalidFieldsError('email'))
      }
    }catch(err){
      console.error(err)
      return serverError()
    }
  }
}
