import {EmailValidatorAdapter,emailSchema} from './EmailVAlidatorAdapter'

const emailVAlidationAdapterStub = new EmailValidatorAdapter()
describe('Email VAlidator Adapter',  () => {

  test('should return false if EmailValidatorAdapter returns false', async () => {
    jest.spyOn(emailVAlidationAdapterStub,'isValid').mockImplementationOnce( async () => {
        return new Promise(resolve=>resolve(false))
    })
    const validatorResponse = await emailVAlidationAdapterStub.isValid('invalidEmail@test.com')
    expect(validatorResponse).toBe(false)
  }) 

  test('should return true if EmailValidatorAdapter returns true', async () => {
    jest.spyOn(emailVAlidationAdapterStub,'isValid').mockImplementationOnce( async () => {
        return new Promise(resolve=>resolve(true))
    })
    const validatorResponse = await emailVAlidationAdapterStub.isValid('validEmail')
    expect(validatorResponse).toBe(true)
  })
  
  test('should call EmailValidatorAdapter with correct email', async () => {
      const email = 'test@teste.com'
      const spy = jest.spyOn(emailSchema,'validate')
      await emailVAlidationAdapterStub.isValid(email)
      expect(spy).toHaveBeenCalledWith(email)
  })
})
