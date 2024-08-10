import { Color, Object3D, SpotLight } from 'three';
import SceneComponent from './SceneComponent';
import { UProperty } from './Decorators';

export default class SpotlightComponent extends SceneComponent {
  @UProperty()
  public Color: Color = new Color(0xffffff);

  @UProperty()
  public Intensity: number = 1;

  protected _spotlight: SpotLight;

  constructor() {
    super();

    this._spotlight = new SpotLight(this.Color, this.Intensity);
    this._spotlight['owner'] = this;
  }

  public Tick(_deltaTime: number): void {
    super.Tick(_deltaTime);

    this._spotlight.color = this.Color;
    this._spotlight.intensity = this.Intensity;
  }

  public GetRenderObject(): Object3D {
    return this._spotlight;
  }

  public BeginPlay(): void {
    super.BeginPlay();

    this.GetWorld()?.GetRenderScene().add(this._spotlight);
  }

  public EndPlay(): void {
    super.EndPlay();

    this.GetWorld()?.GetRenderScene().remove(this._spotlight);
  }
}
