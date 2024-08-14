import { generateUUID } from 'three/src/math/MathUtils';
import { UClass } from './Decorators';

@UClass()
export default class UAsset {
  protected _id: string = generateUUID();
  protected _srcPath?: string;

  protected _name: string;

  constructor(name: string) {
    this._name = name;
  }

  public get Name(): string {
    return this._name;
  }

  public get Id(): string {
    return this._id;
  }

  public get SrcPath(): string | undefined {
    return this._srcPath;
  }

  public set SrcPath(newPath: string) {
    this._srcPath = newPath;
  }
}
