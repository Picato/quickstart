import type from './_.type';

class StringType extends type<string> {
  constructor() {
    super('String', 'string');
  }

  public static required(required: boolean = true) {
    const b = new StringType();
    return b.required(required);
  }

  public static default(dfValue: string) {
    const b = new StringType();
    return b.default(dfValue);
  }

  public static autofocus() {
    const b = new StringType();
    return b.autofocus()
  }

  // GUI
  public form() {
    return super.form(() => {
      if (this._required) return `<div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">${this.fieldName} *</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <input class="input" :class="{'is-danger': errors.has('${this.fieldName}')}" type="text"${this._autofocus ? ' autofocus' : ''} placeholder="${this.fieldName}" v-model.trim="item.${this.fieldName}" name="${this.fieldName}" v-validate="'required'">
                </p>
                <p class="help is-danger" v-show="errors.has('${this.fieldName}')">{{ errors.first('${this.fieldName}') }}</p>
              </div>
            </div>
          </div>`
      return `<div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">${this.fieldName}</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <input class="input" type="text"${this._autofocus ? ' autofocus' : ''} placeholder="${this.fieldName}" v-model.trim="item.${this.fieldName}" name="${this.fieldName}">
                </p>
              </div>
            </div>
          </div>`
    });
  }
}

export default function () {
  return new StringType()
}
