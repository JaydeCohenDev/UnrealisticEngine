import Reflection from './Reflection';

export function UProperty() {
  return function UProperty(parentClass: any, propertyName: string) {
    Reflection.RegisterProperty(parentClass, propertyName);
  };
}

export function UClass() {
  return function UClass(constructor: Function) {};
}

export function UFunction() {
  return function UFunction(originalMethod: any, _context: any) {};
}
