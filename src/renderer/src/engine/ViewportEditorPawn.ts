import CameraComponent from './CameraComponent';
import Pawn from './Pawn';

export default class ViewportEditorPawn extends Pawn {
  protected _camera: CameraComponent;

  constructor() {
    super();

    this._camera = this.AddComponent(CameraComponent);
  }
}
