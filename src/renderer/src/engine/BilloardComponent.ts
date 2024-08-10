import SceneComponent from './SceneComponent';

import { Sprite, SpriteMaterial, Object3D, Color } from 'three';
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

  public SetTexture(texture: Texture2d) {
    (this._sprite.material as SpriteMaterial).map = texture.Data;
  }

  public SetColor(color: Color) {
    (this._sprite.material as SpriteMaterial).color = color;
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
