import UAsset from './Asset';
import * as THREE from 'three';
import { UClass } from './Decorators';

@UClass()
export default class Texture2d extends UAsset {
  protected _data: THREE.Texture;

  constructor(name: string, path: string) {
    super(name);
    this._data = new THREE.TextureLoader().load(path);
    this._data.wrapS = THREE.RepeatWrapping;
    this._data.wrapT = THREE.RepeatWrapping;
  }

  public get Data(): THREE.Texture {
    return this._data;
  }

  public Serialize(): string {
    this._assetPath = this._data.source.data['currentSrc'];
    return super.Serialize();
  }

  public Deserialize(assetData) {
    super.Deserialize(assetData);
    //console.log(this.RuntimePath);
    // this._data = new THREE.TextureLoader().load(this.RuntimePath, (data) => {
    //   this._data = data;
    // });
  }

  public SetRepeat(x: number, y: number): void {
    this._data.repeat.set(x, y);
  }
}
