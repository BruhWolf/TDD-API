export class PasswordConfirmationError extends Error {
    constructor(){
        super(`The pasword and its confirmation must be the same`)
        this.name = 'PasswordConfirmationError'
    }
}