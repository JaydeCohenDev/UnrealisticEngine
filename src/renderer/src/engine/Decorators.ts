import Reflection from './Reflection';
import { UPropertySpecifiers } from './UProperty';

export function UProperty(specifiers?: UPropertySpecifiers) {
  return function UProperty(parentClass: any, propertyName: string) {
    Reflection.RegisterProperty(parentClass, propertyName, specifiers);
  };
}

export function UClass() {
  return function UClass(_constructor: Function) {};
}

export function UFunction() {
  return function UFunction(_originalMethod: any, _context: any) {};
}
