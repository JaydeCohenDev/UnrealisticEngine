import UFunction from './UFunction';
import UProperty from './UProperty';

export type UClassSpecifiers = {};

export default class UClass {
  protected _name: string;
  protected _specifiers: UClassSpecifiers;
  protected _parentClass: UClass | null;
  protected _properties: UProperty[];
  protected _functions: UFunction[];

  protected _isValidated: boolean = false;

  public constructor(
    constructor: Function,
    specifiers: UClassSpecifiers,
    parentClass: UClass | null,
    properties: UProperty[],
    functions: UFunction[]
  ) {
    this._specifiers = specifiers;
    this._properties = properties;
    this._functions = functions;
    this._parentClass = parentClass;

    this._name = constructor.name;
  }

  public get ParentClass(): UClass | null {
    if (this._parentClass === null) return null;
    return this._parentClass.IsValidated ? this._parentClass : null;
  }

  public SignalValidation(): void {
    this._isValidated = true;
  }

  public get IsValidated(): boolean {
    return this._isValidated;
  }

  public UpdateParentClass(parentClass: UClass | null): void {
    this._parentClass = parentClass;
  }

  public UpdateSpecifiers(specifiers: UClassSpecifiers): void {
    this._specifiers = specifiers;
  }
}
