export type SubclassOf<T> = new (...args: any[]) => T;

export class Class {
  protected _subclass: SubclassOf<any>;

  constructor(subclass: SubclassOf<any>) {
    this._subclass = subclass;
  }

  public GetInstance<T>(): T {
    return new this._subclass() as T;
  }
}
