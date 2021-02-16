import { EmailValidator } from "../presentation/protocols/emailValidator";
import Joi from "joi";

export const emailSchema = Joi.string().email().required()

export class EmailValidatorAdapter implements EmailValidator{
    async isValid(email:string): Promise<boolean>{
        const isValid = await emailSchema.validate(email)
        console.log(isValid)
        if(isValid.error) return false
        else return true
    }
}