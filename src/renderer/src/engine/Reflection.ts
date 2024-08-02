import { SubclassOf } from './Class';
import UProperty, { UPropertySpecifiers } from './UProperty';

export default class Reflection {
  protected static _registeredClasses: { [className: string]: UProperty[] } = {};

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

    console.log(`UPROPERTY REGISTERED: ${propertyName} on ${className} of type ${propType}`);
    if (specifiers !== undefined) console.log(specifiers);

    const uProp: UProperty = new UProperty(propType, parentClass, propertyName, specifiers);

    if (!(className in Reflection._registeredClasses)) {
      Reflection._registeredClasses[className] = [];
    }
    Reflection._registeredClasses[className].push(uProp);
  }

  public static GetPropertiesOf(parentClass: Object): UProperty[] {
    const className = parentClass.constructor.name;

    return this._registeredClasses[className] ?? [];
  }

  public static GetPropertiesFrom(classType: SubclassOf<Object>): UProperty[] {
    const className = classType.name;

    return this._registeredClasses[className];
  }
}
