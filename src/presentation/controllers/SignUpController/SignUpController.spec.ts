import { InvalidFieldsError, MissingFieldsError, PasswordConfirmationError, InternalServerError } from '../../errors'
import { EmailValidator,AccountModel,CreateAccount  } from './SignUpProtocols'
import { SignUpController } from './SignUpController'


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
  
  public static typeAccountModel(): AccountModel{
    return {
      id: 'validID',
      name: 'teste',
      email: 'teste@teste.com',
      password: '1234'
    }
  }
}
class EmailValidatorStub implements EmailValidator{
  async isValid(email:string): Promise<boolean>{
    return await new Promise( resolve => resolve(true))
  }
}
class CreateAccountStub implements CreateAccount{
  async create(): Promise<AccountModel>{
    return await new Promise( resolve => resolve(AccountBuilder.typeAccountModel()))
  }
}
const createAccountStub = new CreateAccountStub()
const emailValidatorStub =  new EmailValidatorStub()
const signUpController = new SignUpController( emailValidatorStub,createAccountStub)


describe('SignUpController', () => {
})

test('should return 400 if no name is provided', async () => {
  const httpRequest = {  body: AccountBuilder.anAccount().withNoName()  }
  const httpResponse = await signUpController.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingFieldsError('name'))
})

test('should return 400 if no email is provided', async () => {
  const httpRequest = { body: AccountBuilder.anAccount().withNoEmail() }
  const httpResponse = await signUpController.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingFieldsError('email'))
})

test('should return 400 if no password is provided', async () => {
  const httpRequest = {  body: AccountBuilder.anAccount().withNoPassword() }
  const httpResponse = await signUpController.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingFieldsError('password'))
})

test('should return 400 if no passwordConfirmation is provided', async () => {
  const httpRequest = { body: AccountBuilder.anAccount().withNoPasswordConfirmation() }
  const httpResponse = await signUpController.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new MissingFieldsError('passwordConfirmation'))
})

test('should return 400 if password confirmation fails', async () => {
  const httpRequest = { body: AccountBuilder.anAccount().withWrongPasswordConfirmation() }
  const httpResponse = await signUpController.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new PasswordConfirmationError())
})

test('should return 400 if a invalid email is provided', async () => {
  jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
  const httpRequest = {  body: AccountBuilder.anAccount().withInvalidEmail()  }
  const httpResponse = await signUpController.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(400)
  expect(httpResponse.body).toEqual(new InvalidFieldsError('email'))
})

test('should call emailValidator with correct email', async () => {
  const isValid = jest.spyOn(emailValidatorStub, 'isValid')
  const body = AccountBuilder.anAccount()
  const httpRequest = { body: body  }
  await signUpController.handle(httpRequest)
  expect(isValid).toBeCalledWith(body.email)
})

test('should return 500 if EmailValidator throws any error', async () => {
  jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce( async () => {
     return new Promise( (resolve,reject) => reject(new Error('Unknow error')))
  })
  const httpRequest = { body: AccountBuilder.anAccount()  }
  const httpResponse = await signUpController.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(500)
  expect(httpResponse.body).toEqual(new InternalServerError())
})

test('should call CreateAccount with correct data', async () => {
  const spy = jest.spyOn(createAccountStub, 'create')
  const httpRequest = {  body: AccountBuilder.anAccount() }
  const {name, email, password} = httpRequest.body
  await signUpController.handle(httpRequest)
  expect(spy).toBeCalledWith({name, email, password})
})

test ('should return 500 if CreateAccount throws an Error', async () => {
  jest.spyOn(createAccountStub, 'create').mockImplementationOnce( async () => {
    return new Promise( (resolve, reject) => reject(new Error('Unknow error')))})
  const httpRequest = {  body: AccountBuilder.anAccount()  }
  const httpResponse = await signUpController.handle(httpRequest)
  expect(httpResponse.statusCode).toBe(500)
  expect(httpResponse.body).toEqual(new InternalServerError())
})

  test('should return 201 if valid data is provided', async () => {
    const httpRequest = { body: AccountBuilder.anAccount() }
    const httpResponse = await signUpController.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body).toEqual(AccountBuilder.typeAccountModel())
  })
