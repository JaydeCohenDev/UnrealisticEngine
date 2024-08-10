import { ArrayContains } from './Array';
import { SubclassOf } from './Class';
import UClass, { UClassSpecifiers } from './UClass';
import UProperty, { UPropertySpecifiers } from './UProperty';

export default class Reflection {
  protected static _registeredClasses: { [className: string]: UProperty[] } = {};
  protected static _registeredUClasses: { [className: string]: UClass } = {};

  public static RegisterProperty(
    parentClass: any,
    propertyName: string,
    specifiers?: UPropertySpecifiers
  ) {
    const className = parentClass.constructor.name;

    const parentTarget = Object.getPrototypeOf(parentClass.constructor.prototype);

    const classDefaultObject = new parentClass.constructor();
    let propType: string = typeof classDefaultObject[propertyName];

    if (propType === 'object') {
      propType = classDefaultObject[propertyName].constructor.name;
    }

    console.log(`UPROPERTY REGISTERED: ${propertyName} on ${className} of type ${propType}`);
    if (specifiers !== undefined) console.log(specifiers);

    const uProp: UProperty = new UProperty(propType, parentClass, propertyName, specifiers);

    if (!(className in Reflection._registeredClasses)) {
      Reflection._registeredClasses[className] = [];
    }
    Reflection._registeredClasses[className].push(uProp);
  }

  public static RegisterClass(
    constructor: Function,
    specifiers?: UClassSpecifiers,
    isParentProjection: boolean = false
  ) {
    let parentClass: UClass | null = null;
    const parentClassPrototype = Object.getPrototypeOf(constructor.prototype);
    if (parentClassPrototype !== undefined && parentClassPrototype !== null) {
      const parentClassConstructor = parentClassPrototype.constructor;
      const parentClassName = parentClassConstructor.name;

      if (Reflection._registeredUClasses[parentClassName] === undefined) {
        this.RegisterClass(parentClassConstructor, {}, true);
      }

      parentClass = Reflection._registeredUClasses[parentClassName];
    }

    const classToRegister = Reflection._registeredUClasses[constructor.name];

    if (classToRegister === undefined) {
      const uclass = new UClass(constructor, specifiers || {}, parentClass, [], []);
      Reflection._registeredUClasses[constructor.name] = uclass;
      if (!isParentProjection) uclass.SignalValidation();
      console.log(`UCLASS REGISTERED: ${constructor.name}`);
      console.log(uclass);
    } else {
      classToRegister.UpdateParentClass(parentClass);
      classToRegister.UpdateSpecifiers(specifiers || {});
      if (!isParentProjection) classToRegister.SignalValidation();
      console.log(`UCLASS UPDATED: ${constructor.name}`);
      console.log(classToRegister);
    }

    const classes = this.GetClasses();
    console.log(classes);
  }

  public static GetClasses(): UClass[] {
    const classes: UClass[] = [];

    for (let key in Reflection._registeredUClasses) {
      const uclass = Reflection._registeredUClasses[key];
      if (uclass.IsValidated) classes.push(uclass);
    }

    return classes;
  }

  public static GetPropertiesOf(parentClass: Object): UProperty[] {
    const className = parentClass.constructor.name;

    return this._registeredClasses[className] ?? [];
  }

  public static GetPropertiesFrom(classType: SubclassOf<Object>): UProperty[] {
    const className = classType.name;

    return this._registeredClasses[className];
  }

  public static GetPropertyCategoriesOf(parentClass: Object): string[] {
    const categories: string[] = [];

    this.GetPropertiesOf(parentClass).forEach((uprop) => {
      const categoryName: string = uprop.GetCategory();
      if (!ArrayContains(categories, categoryName)) {
        categories.push(categoryName);
      }
    });

    return categories;
  }
}
