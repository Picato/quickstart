import Type from './_.type'
import * as _ from 'lodash'

class ObjectType extends Type<any> {
  public _schema: any

  constructor() {
    super('Object', 'object')
  }

  public schema(_schema: any) {
    this._schema = _schema
    let beanType = []
    _.forOwn(this._schema, (fieldType, fieldName) => {
      if (typeof fieldType === 'function') {
        this._schema[fieldName] = fieldType = fieldType.required()
      }
      fieldType.fieldName = fieldName
      beanType.push(`${fieldName}?: ${fieldType.beanType}`)
    })
    this.beanType = `{${beanType.join('\n')}}`
    return this
  }

  // Service
  public validateInsert(item) {
    return this.validate(item, 0)
  }
  public validateUpdate(item) {
    return this.validate(item, 1)
  }

  private checkWhenHas(item, fieldName, type: number) {
    let rs = []
    _.forOwn(this._schema, (fieldType, fieldName1) => {
      fieldType.fieldName = fieldName1
      if (type === 0) {
        if (fieldType.validateInsert) rs.push(fieldType.validateInsert(`${item}${fieldName}`))
      } else {
        if (fieldType.validateUpdate) rs.push(fieldType.validateUpdate(`${item}${fieldName}`))
      }
    })
    if (rs.length > 0) {
      return `${rs.join('\n')}`
    }
    return ''
  }
  private validate(item, t) {
    let cnt = ''
    if (t === 1) {
      if (!this._schema) cnt = `Checker.option(${item ? `${item}` : ''}, '${this.fieldName}', Object)`
      else cnt = `Checker.option(${item ? `${item}` : ''}, '${this.fieldName}', Object, undefined, (${this.fieldName})=>{${this.checkWhenHas('', this.fieldName, t)}})`
    } else {
      if (this._dfValue) {
        cnt = `Checker.option(${item ? `${item}` : ''}, '${this.fieldName}', Object, ${Type.ostringify(this._dfValue, null, '\t')})`
        if (this._schema) cnt += this.checkWhenHas(`${item}.`, this.fieldName, t)
      } else {
        if (this._required) {
          cnt = `Checker.required(${item ? `${item}` : ''}, '${this.fieldName}', Object)`
          if (this._schema) cnt += this.checkWhenHas(`${item}.`, this.fieldName, t)
        } else {
          if (this._schema) {
            cnt = `Checker.option(${item ? `${item}` : ''}, '${this.fieldName}', Object, undefined, (${this.fieldName})=>{${this.checkWhenHas('', this.fieldName, t)}})`
          } else {
            cnt = `Checker.option(${item ? `${item}` : ''}, '${this.fieldName}', Object)`
          }
        }
      }

    }
    return cnt
  }
}

export default function () {
  return new ObjectType()
}
