import { MissingFieldsError } from '../errors/MissingFieldsError'
import { PasswordConfirmationError } from '../errors/PasswordConfirmationError'
import { SignUpController } from './SignUpController'

const makeSut = (): SignUpController => new SignUpController()


describe('SignUpController', () => {
})

test('should return 400 if no name is provided', () => {
  const sut = makeSut()
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
  const sut = makeSut()
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
  const sut = makeSut()
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
  const sut = makeSut()
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
