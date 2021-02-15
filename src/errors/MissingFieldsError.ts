export class MissingFieldsError extends Error {
    constructor(fieldName: string){
        super(`Missing field: ${fieldName}`)
        this.name = 'MissingFieldsError'
    }
}
