import type from './_.type';

class BooleanType extends type<boolean> {
  constructor() {
    super('Boolean', 'boolean');
  }

  public static required(required: boolean = true) {
    const b = new BooleanType();
    return b.required(required);
  }

  public static default(dfValue: boolean) {
    const b = new BooleanType();
    return b.default(dfValue);
  }

  // GUI
  public form() {
    return super.form(() => {
      return `<div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">${this.fieldName}</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">                
                  <input type="checkbox" v-model="item.${this.fieldName}">
                </p>
              </div>
            </div>
          </div>`
    })
  }

}
const boolean = BooleanType;
export default boolean;