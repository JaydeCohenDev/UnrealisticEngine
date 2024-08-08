import { UClass, UProperty } from './Decorators';
import SceneComponent from './SceneComponent';
import * as THREE from 'three';

@UClass()
export default class DirectionalLightComponent extends SceneComponent {
  protected _light: THREE.DirectionalLight;
  protected _helper: THREE.CameraHelper;

  @UProperty()
  protected Intensity: number = 1;

  @UProperty()
  protected LightColor: THREE.Color = new THREE.Color(0xffffff);

  @UProperty()
  protected CastShadow: boolean = true;

  protected _lightDirTarget: THREE.Object3D;

  constructor() {
    super();

    this._light = new THREE.DirectionalLight(0xffffff, 1); // TODO expose params
    this._light.position.set(0, 0, 0);
    this._helper = new THREE.CameraHelper(this._light.shadow.camera);

    this._lightDirTarget = new THREE.Object3D();
    this._light.target = this._lightDirTarget;

    // TODO expose params
    this._light.castShadow = true;
    this._light.shadow.mapSize.width = 512;
    this._light.shadow.mapSize.height = 512;
    this._light.shadow.camera.near = 0.5;
    this._light.shadow.camera.far = 50;
    // TODO expose params
  }

  public GetRenderObject(): THREE.Object3D {
    return this._light;
  }

  public Tick(_deltaTime: number): void {
    this._light.color = this.LightColor;
    this._light.intensity = this.Intensity;
    this._light.castShadow = this.CastShadow;

    const owner = this.GetOwner();
    if (owner !== undefined && owner !== null) {
      const lightPos = owner.GetActorLocation().add(owner.GetForwardVector());

      this._lightDirTarget.position.copy(lightPos);
    }
  }

  public BeginPlay(): void {
    super.BeginPlay();

    const world = this.GetWorld();
    if (world !== undefined) {
      world.GetRenderScene().add(this._light);
      world.GetRenderScene().add(this._lightDirTarget);
    }
  }

  public EndPlay(): void {
    super.EndPlay();

    const world = this.GetWorld();
    if (world !== undefined) {
      world.GetRenderScene().remove(this._light);
      world.GetRenderScene().remove(this._lightDirTarget);
    }
  }
}
