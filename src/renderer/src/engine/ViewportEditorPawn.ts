import { Vector2, Vector3 } from 'three';
import CameraComponent from './CameraComponent';
import Input from './Input';
import Pawn from './Pawn';
import Message from './Message';

export default class ViewportEditorPawn extends Pawn {
  protected _camera: CameraComponent;
  protected _moveSpeed: number = 5;

  constructor() {
    super();

    this._camera = this.AddComponent(CameraComponent);

    Message.AddListener('MOUSE_WHEEL', (data) => {
      this._moveSpeed += data.wheelDelta / 1000;
    });
  }

  public Tick(_deltaTime: number): void {
    if (window.RenderContext === undefined) return;

    const canvas: HTMLCanvasElement = window.RenderContext.GetRenderer().domElement;
    if (document.pointerLockElement !== canvas) return;

    let moveDir = new Vector2();

    if (Input.IsKeyDown('KeyW')) {
      moveDir.x = 1;
    } else if (Input.IsKeyDown('KeyS')) {
      moveDir.x = -1;
    }

    if (Input.IsKeyDown('KeyD')) {
      moveDir.y = 1;
    } else if (Input.IsKeyDown('KeyA')) {
      moveDir.y = -1;
    }
    moveDir = moveDir.lengthSq() > 0 ? moveDir.normalize() : moveDir;

    let forwardVector: Vector3 = new Vector3();
    window.Camera.getWorldDirection(forwardVector);
    const rightVector = new Vector3(1, 0, 0).applyQuaternion(window.Camera.quaternion);

    const moveVector = moveDir.multiplyScalar(_deltaTime * this._moveSpeed);

    window.Camera.position.add(forwardVector.multiplyScalar(moveVector.x));
    window.Camera.position.add(rightVector.multiplyScalar(moveVector.y));
  }
}
