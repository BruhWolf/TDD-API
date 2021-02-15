import { SignUpController } from './SignUpController'
describe('SignUpController', () => {
})
test('should return 400 if no name is not provided', () => {
  const sut = new SignUpController()
  const httpRequest = {
    body: {
      email: 'teste@teste.com',
      password: '1234',
      passwordConfirmation: '1234'
    }
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new Error('Missing param: name'))
})
test('should return 400 if no email is not provided', () => {
  const sut = new SignUpController()
  const httpRequest = {
    body: {
      name: 'teste',
      password: '1234',
      passwordConfirmation: '1234'
    }
  }
  const httpResponse = sut.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new Error('Missing param: email'))
})
