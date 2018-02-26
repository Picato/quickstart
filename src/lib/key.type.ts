import type from './_.type';

class KeyType extends type<string> {

  constructor() {
    super('Uuid');
    this._hide = true;
  }

}

export default function () {
  return new KeyType()
}
