import { UClass, UFunction, UProperty } from './Decorators';
import SceneComponent from './SceneComponent';
import * as THREE from 'three';

@UClass()
export default class SkyLightComponent extends SceneComponent {
  protected _skylight: THREE.AmbientLight;

  @UProperty()
  public LightColor: THREE.ColorRepresentation = 0xffffff;

  @UProperty()
  public Intensity: number = 0.5;

  constructor() {
    super();

    this._skylight = new THREE.AmbientLight(0xffffff, 0.5);
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
