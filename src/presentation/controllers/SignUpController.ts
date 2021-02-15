import {HttpRequest,HttpResponse,Controller,EmailValidator} from '../protocols'
import {badRequest,serverError} from '../helpers/httpResponse.helper'
import {MissingFieldsError,PasswordConfirmationError,InvalidFieldsError} from '../errors'
import {AccountModel} from '../../domain/models/AccountModel'
import {CreateAccount} from '../../domain/use_cases/createAccount/createAccount'


export class SignUpController implements Controller {

  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly createAccount: CreateAccount
    ){}

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name','email','password','passwordConfirmation']
    try{
        for(const field of requiredFields){
          if (!httpRequest.body[field]){
            return badRequest(new MissingFieldsError(field))
          }
        }
        const {name, email, password, passwordConfirmation} = httpRequest.body
        if(!this.emailValidator.isValid(email)){
          return badRequest( new InvalidFieldsError('email'))
        }
        if (password !== passwordConfirmation){
          return badRequest( new PasswordConfirmationError())
        }
        this.createAccount.create({name, email, password})
    }catch(err){
      return serverError()
    }
  }
}
