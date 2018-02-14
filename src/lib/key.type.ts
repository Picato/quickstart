import type from './_.type';

class KeyType extends type<string> {
        
    constructor(){
        super('Uuid');
        this._hide = true;
    }        
    
}
const key = new KeyType();
export default key;