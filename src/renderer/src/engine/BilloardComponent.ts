import SceneComponent from './SceneComponent';

import { Sprite, SpriteMaterial, Object3D } from 'three';
import Texture2d from './Texture2d';

export default class BillboardComponent extends SceneComponent {
  protected _sprite: Sprite;

  constructor() {
    super();

    const texture = new Texture2d('src/assets/edUI/icons/icon-misc.png');
    const mat = new SpriteMaterial({ map: texture.Data });
    this._sprite = new Sprite(mat);
    this._sprite['owner'] = this;
  }

  public GetRenderObject(): Object3D {
    return this._sprite;
  }

  public BeginPlay(): void {
    super.BeginPlay();

    this.GetWorld()?.GetRenderScene().add(this._sprite);
  }

  public EndPlay(): void {
    super.EndPlay();

    this.GetWorld()?.GetRenderScene().remove(this._sprite);
  }
}
