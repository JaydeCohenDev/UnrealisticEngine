import Reflection from './Reflection';
import { UClassSpecifiers } from './UClass';
import { UFunctionSpecifiers } from './UFunction';
import { UPropertySpecifiers } from './UProperty';

export function UProperty(specifiers?: UPropertySpecifiers) {
  return function UProperty(parentClass: any, propertyName: string) {
    Reflection.RegisterProperty(parentClass, propertyName, specifiers);
  };
}

export function UClass(specifiers?: UClassSpecifiers) {
  return function UClass(constructor: Function) {
    Reflection.RegisterClass(constructor, specifiers);
  };
}

export function UFunction(specifiers?: UFunctionSpecifiers) {
  return function UFunction(_originalMethod: any, _context: any) {};
}
