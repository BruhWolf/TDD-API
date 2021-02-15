import { InvalidFieldsError, MissingFieldsError, PasswordConfirmationError, InternalServerError } from '../errors'
import { EmailValidator } from '../protocols/emailValidator'
import { SignUpController } from './SignUpController'

interface SutTypes{
  sut: SignUpController
  emailValidatorStub: EmailValidator
}
const makeSut = (): SutTypes => {

  class EmailValidatorStub implements EmailValidator{
    isValid(email:string){
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return{
    sut,
    emailValidatorStub
   }

}
interface AccountDTO {
  name?: string
  email?: string
  password?: string
  passwordConfirmation?: string
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


describe('SignUpController', () => {
})

test('should return 400 if no name is provided', () => {
  const {sut} = makeSut()
  const httpRequest = {
    body: AccountBuilder.anAccount().withNoName()
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingFieldsError('name'))
})

test('should return 400 if no email is provided', () => {
  const {sut} = makeSut()
  const httpRequest = {
    body: AccountBuilder.anAccount().withNoEmail()
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingFieldsError('email'))
})

test('should return 400 if no password is provided', () => {
  const {sut} = makeSut()
  const httpRequest = {
    body: AccountBuilder.anAccount().withNoPassword()
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingFieldsError('password'))
})

test('should return 400 if no passwordConfirmation is provided', () => {
  const {sut} = makeSut()
  const httpRequest = {
    body: AccountBuilder.anAccount().withNoPasswordConfirmation()
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingFieldsError('passwordConfirmation'))
})

test('should return 400 if password is not equal to passwordConfirmation', () => {
  const {sut} = makeSut()
  const httpRequest = {
    body: AccountBuilder.anAccount().withWrongPasswordConfirmation()
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new PasswordConfirmationError())
})

test('should return 400 if a invalid email is provided', () => {
  const {sut, emailValidatorStub} = makeSut()
  jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
  const httpRequest = {
    body: AccountBuilder.anAccount().withInvalidEmail()
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new InvalidFieldsError('email'))
})

test('should call emailValidator with correct email', () => {
  const {sut, emailValidatorStub} = makeSut()
  const isValid = jest.spyOn(emailValidatorStub, 'isValid')
  const body = AccountBuilder.anAccount()
  const httpRequest = {
    body: body
  }
  sut.handle(httpRequest)
  expect(isValid).toBeCalledWith(body.email)
})

test('should return 500 if EmailValidator throws any error', () => {
  const {sut, emailValidatorStub} = makeSut()
  const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
  const httpRequest = {
    body: AccountBuilder.anAccount()
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(500)
  expect(httpResponse.body).toEqual(new InternalServerError())
})