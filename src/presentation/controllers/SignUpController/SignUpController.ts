import {HttpRequest,HttpResponse,Controller,EmailValidator,CreateAccount} from './SignUpProtocols'
import {badRequest,serverError} from '../../helpers/httpResponse.helper'
import {MissingFieldsError,PasswordConfirmationError,InvalidFieldsError} from '../../errors'


export class SignUpController implements Controller {

  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly createAccount: CreateAccount
    ){}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['name','email','password','passwordConfirmation']
    try{
        for(const field of requiredFields){
          if (!httpRequest.body[field]){
            return badRequest(new MissingFieldsError(field))
          }
        }
        const {name, email, password, passwordConfirmation} = httpRequest.body
        if(!await this.emailValidator.isValid(email)){
          return badRequest( new InvalidFieldsError('email'))
        }
        if (password !== passwordConfirmation){
          return badRequest( new PasswordConfirmationError())
        }
        const res = await this.createAccount.create({name, email, password})
        return {
          statusCode: 201,
          body: res
        }
    }catch(err){
      return serverError()
    }
  }
}
