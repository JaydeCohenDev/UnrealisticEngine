import UAsset from './Asset';
import * as THREE from 'three';
import { UClass } from './Decorators';

@UClass()
export default class Texture2d extends UAsset {
  protected _data: THREE.Texture;

  public get Data(): THREE.Texture {
    return this._data;
  }

  constructor(name: string, data: THREE.Texture) {
    super(name);
    this._data = new THREE.TextureLoader().load('');
    this._data.wrapS = THREE.RepeatWrapping;
    this._data.wrapT = THREE.RepeatWrapping;
  }

  public SetRepeat(x: number, y: number): void {
    this._data.repeat.set(x, y);
  }
}
