import { Object3D } from 'three';
import SceneComponent from './SceneComponent';

export default class CameraComponent extends SceneComponent {
  protected _renderObj: Object3D;

  public constructor() {
    super();

    this._renderObj = new Object3D();
  }

  public GetRenderObject(): Object3D {
    return this._renderObj;
  }
}
