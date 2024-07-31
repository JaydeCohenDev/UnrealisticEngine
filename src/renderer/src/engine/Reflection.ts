export default class Reflection {
  protected static _registeredClasses: { [className: string]: string[] } = {};

  static RegisterProperty(parentClass: any, propertyName: string) {
    const className = parentClass.constructor.name;

    console.log(`UPROPERTY REGISTERED: ${propertyName} on ${className}`);

    if (!(className in Reflection._registeredClasses)) {
      Reflection._registeredClasses[className] = [];
    }
    Reflection._registeredClasses[className].push(propertyName);

    console.log(Reflection._registeredClasses);
  }
}
