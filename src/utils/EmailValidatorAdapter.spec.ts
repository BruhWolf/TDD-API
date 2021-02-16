import { EmailValidator } from "../presentation/protocols/emailValidator"
import {EmailValidatorAdapter,validator} from './EmailVAlidatorAdapter'


const emailVAlidationAdapterStub = new EmailValidatorAdapter()
describe('Email VAlidator Adapter',  () => {

  test('should return false if EmailValidatorAdapter returns false', async () => {
    jest.spyOn(emailVAlidationAdapterStub,'isEmail').mockImplementationOnce( async () => {
        return new Promise(resolve=>resolve(false))
    })
    const validatorResponse = await emailVAlidationAdapterStub.isEmail('invalidEmail@test.com')
    expect(validatorResponse).toBe(false)
  }) 

  test('should return true if EmailValidatorAdapter returns true', async () => {
    jest.spyOn(emailVAlidationAdapterStub,'isEmail').mockImplementationOnce( async () => {
        return new Promise(resolve=>resolve(true))
    })
    const validatorResponse = await emailVAlidationAdapterStub.isEmail('validEmail')
    expect(validatorResponse).toBe(true)
  })
  
  test('should call EmailValidatorAdapter with correct email', async () => {
      const email = 'test@teste.com'
      const spy = jest.spyOn(validator,'validate')
      await emailVAlidationAdapterStub.isEmail(email)
      expect(spy).toHaveBeenCalledWith(email)
  })
})
