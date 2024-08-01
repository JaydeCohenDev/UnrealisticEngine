export default class UProperty {
  protected _typeName: string;
  protected _parentObject: Object;
  protected _propertyName: string;

  public constructor(typeName: string, parentObj: Object, propName: string) {
    this._typeName = typeName;
    this._parentObject = parentObj;
    this._propertyName = propName;
  }

  public GetTypeName(): string {
    return this._typeName;
  }

  public GetParentObject(): Object {
    return this._parentObject;
  }

  public GetPropertyName(): string {
    return this._propertyName;
  }

  public GetCurrentValueOf(target: Object): any {
    return target[this._propertyName];
  }

  public SetCurrentValueOf(target: Object, newValue: any): void {
    target[this._propertyName] = newValue;
  }
}
