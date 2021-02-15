export class PasswordConfirmationError extends Error {
    constructor(){
        super(`pasword and passwordConfirmation must be equal`)
        this.name = 'PasswordConfirmationError'
    }
}