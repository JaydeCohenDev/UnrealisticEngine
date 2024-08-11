import Actor from './Actor';
import BillboardComponent from './BilloardComponent';
import { UClass } from './Decorators';
import SpotlightComponent from './SpotlightComponent';
import Texture2d from './Texture2d';

@UClass()
export default class SpotlightActor extends Actor {
  protected _spotlightComponent: SpotlightComponent;
  protected _billboard: BillboardComponent;

  constructor() {
    super();

    this._spotlightComponent = this.AddComponent(SpotlightComponent);
    this._billboard = this.AddComponent(BillboardComponent);

    const spriteTex = new Texture2d('src/assets/edUI/icons/icon-spotlight.png');
    this._billboard.SetTexture(spriteTex);
  }

  public BeginPlay(): void {
    super.BeginPlay();

    this._billboard.AttachTo(this._spotlightComponent);
  }

  public Tick(_deltaTime: number): void {
    super.Tick(_deltaTime);

    this._billboard.SetColor(this._spotlightComponent.Color);
  }
}
