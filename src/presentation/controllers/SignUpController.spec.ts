import { InvalidFieldsError, MissingFieldsError, PasswordConfirmationError, InternalServerError } from '../errors'
import { EmailValidator } from '../protocols/emailValidator'
import { SignUpController } from './SignUpController'


class EmailValidatorStub implements EmailValidator{
  isValid(email:string){
    return true
  }
}
class AccountBuilder {
    public name?:string ='teste'
    public email?:string = 'teste@teste.com'
    public password?:string = '1234'
    public passwordConfirmation?:string = '1234'

  public static anAccount(): AccountBuilder{
    return new AccountBuilder()
  }

  public withNoName(){
   delete this.name
   return this
  }

  public withNoEmail(){
   delete this.email
   return this
  }

  public withNoPassword(){
   delete this.password
   return this
  }
  
  public withNoPasswordConfirmation(){
   delete this.passwordConfirmation
   return this
  }
  
  public withWrongPasswordConfirmation(){
   this.passwordConfirmation = 'abc'
   return this

  }
  public withInvalidEmail(){
   this.email = 'InvalidEmail'
   return this
  }
}

const emailValidatorStub =  new EmailValidatorStub()
const signUpController = new SignUpController( emailValidatorStub)


describe('SignUpController', () => {
})

test('should return 400 if no name is provided', () => {
  const httpRequest = {  body: AccountBuilder.anAccount().withNoName()  }
  const httpResponse = signUpController.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingFieldsError('name'))
})

test('should return 400 if no email is provided', () => {
  const httpRequest = { body: AccountBuilder.anAccount().withNoEmail() }
  const httpResponse = signUpController.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingFieldsError('email'))
})

test('should return 400 if no password is provided', () => {
  const httpRequest = {  body: AccountBuilder.anAccount().withNoPassword() }
  const httpResponse = signUpController.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingFieldsError('password'))
})

test('should return 400 if no passwordConfirmation is provided', () => {
  const httpRequest = { body: AccountBuilder.anAccount().withNoPasswordConfirmation() }
  const httpResponse = signUpController.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingFieldsError('passwordConfirmation'))
})

test('should return 400 if password confirmation fails', () => {
  const httpRequest = { body: AccountBuilder.anAccount().withWrongPasswordConfirmation() }
  const httpResponse = signUpController.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new PasswordConfirmationError())
})

test('should return 400 if a invalid email is provided', () => {
  jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
  const httpRequest = {
    body: AccountBuilder.anAccount().withInvalidEmail()
  }
  const httpResponse = signUpController.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new InvalidFieldsError('email'))
})

test('should call emailValidator with correct email', () => {
  const isValid = jest.spyOn(emailValidatorStub, 'isValid')
  const body = AccountBuilder.anAccount()
  const httpRequest = { body: body  }
  signUpController.handle(httpRequest)
  expect(isValid).toBeCalledWith(body.email)
})

test('should return 500 if EmailValidator throws any error', () => {
  jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(()=>{throw new Error('Unknow error')})
  const httpRequest = { body: AccountBuilder.anAccount()  }
  const httpResponse = signUpController.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(500)
  expect(httpResponse.body).toEqual(new InternalServerError())
})