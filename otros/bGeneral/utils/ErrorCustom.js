export class ECustom extends Error{
    constructor (msg, modulo, pila, miError){
        super(msg),
        this.modulo = modulo,
        this.pila = pila,
        this.miError = miError
    }
}