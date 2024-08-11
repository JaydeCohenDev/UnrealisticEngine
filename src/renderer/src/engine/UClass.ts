import Reflection from './Reflection';
import UFunction from './UFunction';
import UProperty from './UProperty';

export type UClassSpecifiers = {};

export default class UClass {
  protected _name: string;
  protected _specifiers: UClassSpecifiers;
  protected _parentClass: UClass | null;
  protected _properties: UProperty[];
  protected _functions: UFunction[];
  protected _constructor: any;

  protected _isValidated: boolean = false;

  public constructor(
    constructor: Function,
    specifiers: UClassSpecifiers,
    parentClass: UClass | null,
    properties: UProperty[],
    functions: UFunction[]
  ) {
    this._constructor = constructor;
    this._specifiers = specifiers;
    this._properties = properties;
    this._functions = functions;
    this._parentClass = parentClass;

    this._name = constructor.name;
  }

  public IsChildClassOf<T extends Object>(object: T): boolean {
    const anscestorClassName = object['name'];
    const anscestorClass: UClass | undefined = Reflection.GetClassByName(anscestorClassName);

    if (anscestorClass === undefined) return false;

    let parent = this.ParentClass;
    while (parent !== undefined && parent !== null) {
      if (parent === anscestorClass) {
        return true;
      }

      parent = parent.ParentClass;
    }

    return false;
  }

  public NewInstance<T extends Object>() {
    return new this._constructor() as T;
  }

  public get DisplayName(): string {
    return this._name;
  }

  public get ParentClass(): UClass | null {
    if (this._parentClass === null) return null;
    return this._parentClass.IsValidated ? this._parentClass : null;
  }

  public get Properties(): UProperty[] {
    return this._properties;
  }

  public SignalValidation(): void {
    this._isValidated = true;
  }

  public get IsValidated(): boolean {
    return this._isValidated;
  }

  public AddProperty(property: UProperty) {
    this._properties.push(property);
  }

  public UpdateParentClass(parentClass: UClass | null): void {
    this._parentClass = parentClass;
  }

  public UpdateSpecifiers(specifiers: UClassSpecifiers): void {
    this._specifiers = specifiers;
  }
}
