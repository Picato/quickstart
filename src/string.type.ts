import Type from './_.type'

export class StringType extends Type<string> {
  constructor() {
    super('String', 'string')
  }

}

export default function () {
  return new StringType()
}
