import Reflection from './Reflection';
import { UPropertySpecifiers } from './UProperty';

export function UProperty(specifiers?: UPropertySpecifiers) {
  return function UProperty(parentClass: any, propertyName: string) {
    Reflection.RegisterProperty(parentClass, propertyName, specifiers);
  };
}

export function UClass() {
  return function UClass(constructor: Function) {};
}

export function UFunction() {
  return function UFunction(originalMethod: any, _context: any) {};
}
