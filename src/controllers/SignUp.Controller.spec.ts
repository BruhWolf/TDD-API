import { SignUpController } from './SignUpController'
describe('SignUpController', () => {
  test('should return 400 if no name is provided', () => {
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
  })
})
