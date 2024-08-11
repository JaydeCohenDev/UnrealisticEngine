import { UClass } from './Decorators';
import LightComponent from './LightComponent';
import * as THREE from 'three';

@UClass()
export default class SkyLightComponent extends LightComponent {
  protected _skylight: THREE.AmbientLight;

  constructor() {
    super();

    this._skylight = new THREE.AmbientLight(0xffffff, 0.5);
  }

  public GetRenderObject(): THREE.Object3D {
    return this._skylight;
  }

  public AllowShadowCasting(): boolean {
    return false;
  }
}
