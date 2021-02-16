import { EmailValidator } from "../presentation/protocols/emailValidator";

interface Validator{
    validate: (email:string)=>Promise<boolean>
}
export const validator: Validator = {

    validate: async (email:string): Promise<boolean> => {
        return new Promise((resolve,reject)=>{
            const pattern = /\S+@\S+\.\S+/
            try{
                const result = pattern.test(email)
                resolve(result)
            }catch(error){
                reject(error)
            }
        })
    }
}

export class EmailValidatorAdapter implements EmailValidator{
    async isEmail(email:string): Promise<boolean>{
        const isValid = await validator.validate(email)
       return isValid
}