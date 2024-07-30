import Asset from './Asset';
import * as THREE from 'three';

export default class Texture2d extends Asset {
  protected _path: string;
  protected _data: THREE.Texture;

  public get Data(): THREE.Texture {
    return this._data;
  }

  constructor(path: string) {
    super();

    this._path = path;

    this._data = new THREE.TextureLoader().load(this._path);
    this._data.wrapS = THREE.RepeatWrapping;
    this._data.wrapT = THREE.RepeatWrapping;
    this._data.repeat.set(4, 4);
  }
}
