import type from './_.type';
import * as _ from 'lodash';

class ObjectType extends type<any> {
  //Publish
  public static required(required: boolean = true) {
    const b = new ObjectType();
    return b.required(required);
  }
  public static schema(_schema: any) {
    const b = new ObjectType();
    return b.schema(_schema);
  }
  public static default(dfValue: any) {
    const b = new ObjectType();
    return b.default(dfValue);
  }

  public _schema: any;

  constructor() {
    super('Object', 'object');
  }

  public schema(_schema: any) {
    this._schema = _schema;
    let beanType = [];
    _.forOwn(this._schema, (fieldType, fieldName) => {
      if (typeof fieldType === 'function') {
        this._schema[fieldName] = fieldType = fieldType.required();
      }
      fieldType.fieldName = fieldName;
      beanType.push(`${fieldName}?: ${fieldType.beanType}`);
    })
    this.beanType = `{${beanType.join(';\n')}}`;
    return this;
  }

}

export default function () {
  return new ObjectType()
}
