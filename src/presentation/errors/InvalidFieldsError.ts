export class InvalidFieldsError extends Error {
    constructor (field:string) {
        super(`The field ${field} is invalid`)
        this.name = 'InvalidFieldsError'
    }
}