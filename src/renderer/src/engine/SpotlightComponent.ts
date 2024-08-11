import { Object3D, SpotLight } from 'three';
import LightComponent from './LightComponent';
import { UClass } from './Decorators';

@UClass()
export default class SpotlightComponent extends LightComponent {
  protected _spotlight: SpotLight;

  constructor() {
    super();

    this._spotlight = new SpotLight(this.Color, this.Intensity);
  }

  public GetRenderObject(): Object3D {
    return this._spotlight;
  }
}
