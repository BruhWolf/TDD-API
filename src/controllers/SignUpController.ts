import {HttpRequest,HttpResponse,Controller,EmailValidator} from '../protocols'
import {badRequest,serverError} from '../helpers/httpResponse.helper'
import {MissingFieldsError,PasswordConfirmationError,InvalidFieldsError} from '../errors'


export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator){}
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name','email','password','passwordConfirmation']
    try{
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
      return serverError()
    }
  }
}
