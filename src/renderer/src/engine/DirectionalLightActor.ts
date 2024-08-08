import Actor from './Actor';
import BillboardComponent from './BilloardComponent';
import DirectionalLightComponent from './DirectionalLightComponent';
import Texture2d from './Texture2d';

export class DirectionalLightActor extends Actor {
  protected _directionalLightComponent: DirectionalLightComponent;
  protected _billboard: BillboardComponent;

  constructor() {
    super();

    const billboardTexture = new Texture2d('src/assets/edUI/icons/icon-directional-light.png');

    this._directionalLightComponent = this.AddComponent(DirectionalLightComponent);
    this._billboard = this.AddComponent(BillboardComponent);
    this._billboard.AttachTo(this._directionalLightComponent);
    this._billboard.SetTexture(billboardTexture);
  }
}
