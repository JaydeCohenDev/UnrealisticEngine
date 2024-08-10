import { Color, Light } from 'three';
import SceneComponent from './SceneComponent';
import { UClass, UProperty } from './Decorators';

@UClass()
export default class LightComponent extends SceneComponent {
  @UProperty()
  public Color: Color = new Color(0xffffff);

  @UProperty()
  public Intensity: number = 1;

  @UProperty()
  protected CastShadow: boolean = true;

  public GetLightComponent(): Light {
    return this.GetRenderObject() as Light;
  }

  public BeginPlay(): void {
    super.BeginPlay();

    this.GetWorld()?.GetRenderScene().add(this.GetLightComponent());
  }

  public Tick(_deltaTime: number): void {
    super.Tick(_deltaTime);

    this.GetLightComponent().color = this.Color;
    this.GetLightComponent().intensity = this.Intensity;
    this.GetLightComponent().castShadow = this.CastShadow;
  }

  public EndPlay(): void {
    super.EndPlay();

    this.GetWorld()?.GetRenderScene().remove(this.GetLightComponent());
  }
}
