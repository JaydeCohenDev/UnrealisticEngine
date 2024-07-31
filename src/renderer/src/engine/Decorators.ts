import Reflection from './Reflection';

export function UProperty(parentClass: any, propertyName: string) {
  Reflection.RegisterProperty(parentClass, propertyName);
}

export function UClass(constructor: Function) {}
