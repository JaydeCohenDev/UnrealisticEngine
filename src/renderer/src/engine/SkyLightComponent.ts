import SceneComponent from './SceneComponent';
import * as THREE from 'three';

export default class SkyLightComponent extends SceneComponent {
  protected _skylight: THREE.AmbientLight;

  constructor() {
    super();

    this._skylight = new THREE.AmbientLight(0xffffff, 0.5);
  }

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
