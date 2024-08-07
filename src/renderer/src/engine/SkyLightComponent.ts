import { UClass, UFunction, UProperty } from './Decorators';
import SceneComponent from './SceneComponent';
import * as THREE from 'three';

@UClass()
export default class SkyLightComponent extends SceneComponent {
  protected _skylight: THREE.AmbientLight;

  @UProperty()
  public LightColor: THREE.Color = new THREE.Color(0xffffff);

  @UProperty()
  public Intensity: number = 0.5;

  constructor() {
    super();

    this._skylight = new THREE.AmbientLight(0xffffff, 0.5);
  }

  public Tick(_deltaTime: number): void {
    this._skylight.color = this.LightColor;
    this._skylight.intensity = this.Intensity;
  }

  public GetRenderObject(): THREE.Object3D {
    return this._skylight;
  }

  @UFunction()
  public BeginPlay(): void {
    super.BeginPlay();

    const world = this.GetWorld();
    if (world !== undefined) {
      world.GetRenderScene().add(this._skylight);
    }
  }

  public EndPlay(): void {
    super.EndPlay();

    const world = this.GetWorld();
    if (world !== undefined) {
      world.GetRenderScene().remove(this._skylight);
    }
  }
}
