import type from './_.type';

class DateType extends type<string | number> {
  //Publish
  public static required(required: boolean = true) {
    const b = new DateType();
    return b.required(required);
  }
  public static default(dfValue: string | number) {
    const b = new DateType();
    return b.default(dfValue);
  }
  public static auto(dfValue: string) {
    const b = new DateType();
    return b.required(false).default(dfValue);
  }
  // End Publish

  constructor() {
    super('Date');
  }

  public contentTable() {
    return `<td>{{ e.${this.fieldName} | $date }}</td>`
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
                <input class="input" :class="{'is-danger': errors.has('${this.fieldName}')}" type="date" placeholder="${this.fieldName}" v-model.trim="item.${this.fieldName}" name="${this.fieldName}" v-validate="'required'">
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
                <input class="input" type="date" placeholder="${this.fieldName}" v-model.trim="item.${this.fieldName}" name="${this.fieldName}">
                </p>
              </div>
            </div>
          </div>`
    })
  }

}
const date = DateType;
export default date;