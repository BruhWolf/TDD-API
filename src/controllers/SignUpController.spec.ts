import { InternalServerError } from '../errors/InternalServerError'
import { InvalidFieldsError } from '../errors/InvalidFieldsError'
import { MissingFieldsError } from '../errors/MissingFieldsError'
import { PasswordConfirmationError } from '../errors/PasswordConfirmationError'
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


describe('SignUpController', () => {
})

test('should return 400 if no name is provided', () => {
  const {sut} = makeSut()
  const httpRequest = {
    body: {
      email: 'teste@teste.com',
      password: '1234',
      passwordConfirmation: '1234'
    }
  }
  const httpResponse = sut.handle(httpRequest)
  console.log(httpResponse.statusCode)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingFieldsError('name'))
})

test('should return 400 if no email is provided', () => {
  const {sut} = makeSut()
  const httpRequest = {
    body: {
      name: 'teste',
      password: '1234',
      passwordConfirmation: '1234'
    }
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingFieldsError('email'))
})

test('should return 400 if no password is provided', () => {
  const {sut} = makeSut()
  const httpRequest = {
    body: {
      name: 'teste',
      email: 'teste@teste.com',
      passwordConfirmation: '1234'
    }
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingFieldsError('password'))
})

test('should return 400 if no passwordConfirmation is provided', () => {
  const {sut} = makeSut()
  const httpRequest = {
    body: {
      name: 'teste',
      email: 'teste@teste.com',
      password: '1234',
    }
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingFieldsError('passwordConfirmation'))
})

test('should return 400 if password is not equal to passwordConfirmation', () => {
  const {sut} = makeSut()
  const httpRequest = {
    body: {
      name: 'teste',
      password: '1234',
      email: 'teste@teste.com',
      passwordConfirmation: '123',
    }
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new PasswordConfirmationError())
})

test('should return 400 if a invalid email is provided', () => {
  const {sut, emailValidatorStub} = makeSut()
  jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)
  const httpRequest = {
    body: {
      name: 'teste',
      email: 'invalid_email@teste.com',
      password: '1234',
      passwordConfirmation: '1234'
    }
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new InvalidFieldsError('email'))
})

test('should return 500 if EmailValidator throws any error', () => {

  class EmailValidatorStub implements EmailValidator{
    isValid(){
      throw new Error()
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  jest.spyOn(emailValidatorStub, 'isValid').mockReturnValue(false)
  const httpRequest = {
    body: {
      name: 'teste',
      email: 'test@teste.com',
      password: '1234',
      passwordConfirmation: '1234'
    }
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(500)
  expect(httpResponse.body).toEqual(new InternalServerError())
})