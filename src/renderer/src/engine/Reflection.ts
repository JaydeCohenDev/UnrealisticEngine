import { ArrayContains } from './Array';
import { SubclassOf } from './Class';
import Debug from './Logging/Debug';
import UClass, { UClassSpecifiers } from './UClass';
import UEvent from './UEvent';
import UProperty, { UPropertySpecifiers } from './UProperty';

export default class Reflection {
  public static OnUClassRegistryUpdate: UEvent = new UEvent();

  protected static _registeredClasses: { [className: string]: UClass } = {};

  public static RegisterProperty(
    parentClass: any,
    propertyName: string,
    specifiers?: UPropertySpecifiers
  ) {
    const className = parentClass.constructor.name;

    const classDefaultObject = new parentClass.constructor();
    let propType: string = typeof classDefaultObject[propertyName];

    if (propType === 'object') {
      propType = classDefaultObject[propertyName].constructor.name;
    }

    Debug.Log(
      'reflection',
      'Info',
      `UPROPERTY REGISTERED: ${propertyName} on ${className} of type ${propType}`
    );

    if (specifiers !== undefined) {
      //Debug.Log('reflection', 'Info', `${JSON.stringify(specifiers)}`);
    }

    const uProp: UProperty = new UProperty(propType, parentClass, propertyName, specifiers);

    if (Reflection._registeredClasses[className] === undefined) {
      Reflection.RegisterClass(parentClass.constructor, {}, true);
    }

    Reflection._registeredClasses[className].AddProperty(uProp);
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

      if (Reflection._registeredClasses[parentClassName] === undefined) {
        this.RegisterClass(parentClassConstructor, {}, true);
      }

      parentClass = Reflection._registeredClasses[parentClassName];
    }

    const classToRegister = Reflection._registeredClasses[constructor.name];

    if (classToRegister === undefined) {
      const uclass = new UClass(constructor, specifiers || {}, parentClass, [], []);
      Reflection._registeredClasses[constructor.name] = uclass;
      if (!isParentProjection) uclass.SignalValidation();
      Debug.Log('reflection', 'Info', `UCLASS REGISTERED: ${constructor.name}`);
      //Debug.Log('reflection', 'Info', JSON.stringify(uclass));
    } else {
      classToRegister.UpdateParentClass(parentClass);
      classToRegister.UpdateSpecifiers(specifiers || {});
      if (!isParentProjection) classToRegister.SignalValidation();
      Debug.Log('reflection', 'Warning', `UCLASS UPDATED: ${constructor.name}`);
      //console.log(classToRegister);
    }

    Reflection.OnUClassRegistryUpdate.Invoke(undefined);
  }

  public static GetClasses(): UClass[] {
    const classes: UClass[] = [];

    for (let key in Reflection._registeredClasses) {
      const uclass = Reflection._registeredClasses[key];
      if (uclass.IsValidated) classes.push(uclass);
    }

    return classes;
  }

  public static GetClassByName(className: string): UClass | undefined {
    return Reflection._registeredClasses[className];
  }

  public static GetPropertiesOf(parentClass: Object): UProperty[] {
    const className = parentClass.constructor.name;

    const properties: UProperty[] = [];

    let currentClass: UClass | null = this._registeredClasses[className];
    while (currentClass !== undefined && currentClass !== null && currentClass.IsValidated) {
      properties.push(...currentClass.Properties);

      currentClass = currentClass.ParentClass;
    }

    return properties;
  }

  public static GetPropertiesFrom(classType: SubclassOf<Object>): UProperty[] {
    const className = classType.name;

    const properties: UProperty[] = [];

    let currentClass: UClass | null = this._registeredClasses[className];
    while (currentClass !== undefined && currentClass !== null && currentClass.IsValidated) {
      properties.push(...currentClass.Properties);

      currentClass = currentClass.ParentClass;
    }

    return properties;
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
