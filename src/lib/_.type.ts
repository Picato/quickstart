import * as _ from 'lodash';

export default class type<T> {
  public fieldName: string;
  protected _required: boolean = true;
  protected _refer: any;
  protected _autofocus: boolean = false;
  public _dfValue: T;
  protected _hide: boolean = false;
  constructor(protected dataType: string, protected beanType?: string) {
    if (!this.beanType) this.beanType = this.dataType;
  }

  public static ostringify = (a, b?, c?) => {
    if (_.isNil(a)) return a;
    return JSON.stringify(a, b, c).replace(/\"([^(\")"]+)\":/g, "$1:").replace(/"?\$Native\(([^\)]+)\)"?/g, '$1');
  }

  public static required(required: boolean = true) {

  }

  public required(required: boolean = true) {
    this._required = required;
    return this;
  }

  public default(dfValue: T) {
    this._dfValue = dfValue;
    return this;
  }

  // GUI
  public refer(tbl: string, { key, value }) {
    this._refer = {
      tbl,
      tblVar: tbl.toLowerCase(),
      key,
      value
    }
    return this
  }

  public autofocus() {
    this._autofocus = true
    return this
  }

  public hide() {
    this._hide = true
    return this
  }

  public form(cb?: Function) {
    if (this._hide) return '';
    if (this._refer) {
      let required = `<div class="field-body">
            <div class="field">
                <p class="control">
                    <span class="select" :class="{'is-danger': errors.has('${this.fieldName}')}">
                        <select v-model="item.${this.fieldName}" name="${this.fieldName}" v-validate="'required'">
                            <option :value="undefined">Select one</option>
                            <option v-for="${this._refer.tblVar}Item in ${this._refer.tblVar}" :key="${this._refer.tblVar}Item.${this._refer.key}" :value="${this._refer.tblVar}Item.${this._refer.key}">{{${this._refer.tblVar}Item.${this._refer.value}}}</option>
                        </select>
                    </span>
                </p>
                <p class="help is-danger" v-show="errors.has('${this.fieldName}')">{{ errors.first('${this.fieldName}') }}</p>
            </div>
          </div>`;
      let normal = `<div class="field-body">
          <div class="field">
            <p class="control">
              <span class="select">
                <select v-model="item.${this.fieldName}" name="${this.fieldName}">
                  <option :value="undefined">Select one</option>
                  <option v-for="${this._refer.tblVar}Item in ${this._refer.tblVar}" :key="${this._refer.tblVar}Item.${this._refer.key}" :value="${this._refer.tblVar}Item.${this._refer.key}">{{${this._refer.tblVar}Item.${this._refer.value}}}</option>
                </select>
              </span>
            </p>                
          </div>
        </div>`
      return [`import ${this._refer.tbl} from '@/providers/${this._refer.tbl}.provider'`, `${this._refer.tblVar}: []`, `${this._refer.tbl}.find().then(data => this.${this._refer.tblVar} = data)`, `<div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">${this._refer.tbl}${this._required ? ' *' : ''}</label>
          </div>
          ${this._required ? required : normal}
        </div>`]
    } else if (cb) {
      return cb(this);
    }
    return `            <code>${this.fieldName} not defined</code>`
  }

  public titleTable() {
    return `            <th>${this.fieldName}</th>`
  }

  public contentTable() {
    if (this._refer) {
      return `            <td>{{ e.${this.fieldName} | $find(${this._refer.tblVar}) | $show('${this._refer.value}') }}</td>`
    }
    return `            <td>{{ e.${this.fieldName} }}</td>`
  }

}