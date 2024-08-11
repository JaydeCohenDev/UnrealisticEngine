import { Object3D, PointLight, PointLightHelper } from 'three';
import { UClass } from './Decorators';
import LightComponent from './LightComponent';

@UClass()
export default class PointLightComponent extends LightComponent {
  protected _light: PointLight;
  protected _helper: PointLightHelper;

  constructor() {
    super();

    this._light = new PointLight(this.Color, this.Intensity);
    this._helper = new PointLightHelper(this._light);
  }

  public GetRenderObject(): Object3D {
    return this._light;
  }

  public SelectedInEditor(): void {
    super.SelectedInEditor();
    this.GetWorld()?.GetRenderScene().add(this._helper);
    this._helper.update();
  }

  public DeselectedInEdtior(): void {
    super.DeselectedInEdtior();
    this.GetWorld()?.GetRenderScene().remove(this._helper);
  }
}
