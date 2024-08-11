import Actor from './Actor';
import BillboardComponent from './BilloardComponent';
import { UClass } from './Decorators';
import SkyLightComponent from './SkyLightComponent';
import Texture2d from './Texture2d';

@UClass()
export default class SkyLightActor extends Actor {
  protected _skyLightComponent: SkyLightComponent;
  protected _billboardComponent: BillboardComponent;

  constructor() {
    super();

    this._skyLightComponent = this.AddComponent(SkyLightComponent);
    this._billboardComponent = this.AddComponent(BillboardComponent);
    const spriteTex = new Texture2d('src/assets/edUI/icons/icon-skylight.png');
    this._billboardComponent.SetTexture(spriteTex);
  }

  public BeginPlay(): void {
    super.BeginPlay();

    this._billboardComponent.AttachTo(this._skyLightComponent);
  }
}
