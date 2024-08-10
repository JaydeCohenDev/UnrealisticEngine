import { Color, Object3D, PointLight } from 'three';
import SceneComponent from './SceneComponent';
import { UProperty } from './Decorators';

export default class PointLightComponent extends SceneComponent {
  protected _light: PointLight;

  @UProperty()
  public Color: Color = new Color(0xffffff);

  @UProperty({ minVal: 0 })
  public Intensity: number = 1;

  constructor() {
    super();

    this._light = new PointLight(this.Color, this.Intensity);
    this._light['owner'] = this;
  }

  public GetRenderObject(): Object3D {
    return this._light;
  }

  public BeginPlay(): void {
    super.BeginPlay();

    this.GetWorld()?.GetRenderScene().add(this._light);
  }

  public EndPlay(): void {
    super.EndPlay();

    this.GetWorld()?.GetRenderScene().remove(this._light);
  }

  public Tick(_deltaTime: number): void {
    super.Tick(_deltaTime);

    this._light.intensity = this.Intensity;
    this._light.color = this.Color;
  }
}
