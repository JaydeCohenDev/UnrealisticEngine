import Actor from './Actor';
import BillboardComponent from './BilloardComponent';
import DirectionalLightComponent from './DirectionalLightComponent';

export class DirectionalLightActor extends Actor {
  protected _directionalLightComponent: DirectionalLightComponent;
  protected _billboard: BillboardComponent;

  constructor() {
    super();

    this._directionalLightComponent = this.AddComponent(DirectionalLightComponent);
    this._billboard = this.AddComponent(BillboardComponent);
    this._billboard.AttachTo(this._directionalLightComponent);
  }
}
