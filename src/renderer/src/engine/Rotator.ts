import { Euler } from 'three';

export default class Rotator {
  protected _euler: Euler;

  constructor(roll: number = 0, pitch: number = 0, yaw: number = 0) {
    this._euler = new Euler(pitch, yaw, roll);
  }

  public static Zero(): Rotator {
    return new Rotator(0, 0, 0);
  }

  public get Euler(): Euler {
    return this._euler;
  }
}
