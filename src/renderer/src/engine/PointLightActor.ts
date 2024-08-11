import Actor from './Actor';
import BillboardComponent from './BilloardComponent';
import { UClass } from './Decorators';
import PointLightComponent from './PointLightComponent';
import Texture2d from './Texture2d';

@UClass()
export default class PointLightActor extends Actor {
  protected _pointLightComponent: PointLightComponent;
  protected _billboard: BillboardComponent;

  constructor() {
    super();

    this._pointLightComponent = this.AddComponent(PointLightComponent);
    this._billboard = this.AddComponent(BillboardComponent);

    const spriteTex = new Texture2d('src/assets/edUI/icons/icon-pointlight.png');
    this._billboard.SetTexture(spriteTex);
  }

  public Tick(_deltaTime: number): void {
    super.Tick(_deltaTime);

    this._billboard.SetColor(this._pointLightComponent.Color);
  }

  public BeginPlay(): void {
    super.BeginPlay();
    this._billboard.AttachTo(this._pointLightComponent);
  }
}
