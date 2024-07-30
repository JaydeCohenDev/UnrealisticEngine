import SceneComponent from './SceneComponent';
import * as THREE from 'three';

export default class DirectionalLightComponent extends SceneComponent {
  protected _light: THREE.DirectionalLight;
  protected _helper: THREE.CameraHelper;

  constructor() {
    super();

    this._light = new THREE.DirectionalLight(0xffffff, 1); // TODO expose params
    this._helper = new THREE.CameraHelper(this._light.shadow.camera);

    this._light.position.set(0, 10, 0); // TODO move to scene component position

    // TODO expose params
    this._light.castShadow = true;
    this._light.shadow.mapSize.width = 512;
    this._light.shadow.mapSize.height = 512;
    this._light.shadow.camera.near = 0.5;
    this._light.shadow.camera.far = 50;
    // TODO expose params
  }

  public BeginPlay(): void {
    super.BeginPlay();

    const world = this.GetWorld();
    if (world !== undefined) {
      world.GetRenderScene().add(this._light);
      world.GetRenderScene().add(this._helper);
    }
  }

  public EndPlay(): void {
    super.EndPlay();

    const world = this.GetWorld();
    if (world !== undefined) {
      world.GetRenderScene().remove(this._light);
      world.GetRenderScene().remove(this._helper);
    }
  }
}