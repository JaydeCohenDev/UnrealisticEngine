import { Object3D, PointLight } from 'three';
import { UClass } from './Decorators';
import LightComponent from './LightComponent';

@UClass()
export default class PointLightComponent extends LightComponent {
  protected _light: PointLight;

  constructor() {
    super();

    this._light = new PointLight(this.Color, this.Intensity);
    this._light['owner'] = this;
  }

  public GetRenderObject(): Object3D {
    return this._light;
  }
}
