import Message from './Message';
import * as THREE from 'three';
import UEvent from './UEvent';

export type MouseButton = 'MOUSE_LEFT' | 'MOUSE_MIDDLE' | 'MOUSE_RIGHT';

export default class Input {
  public static OnMouseButtonPressed: UEvent = new UEvent();
  public static OnMouseButtonReleased: UEvent = new UEvent();
  public static OnKeyPressed: UEvent = new UEvent();
  public static OnKeyReleased: UEvent = new UEvent();

  protected static Keys: { [id: string]: boolean } = {};
  protected static _mousePosition: THREE.Vector2 = new THREE.Vector2();
  protected static _mouseWheelDelta: number = 0;

  protected static MouseButtons: MouseButton[] = ['MOUSE_LEFT', 'MOUSE_MIDDLE', 'MOUSE_RIGHT'];

  public static get MouseWheelDelta(): number {
    return Input._mouseWheelDelta;
  }

  public static StartListening() {
    Input.Keys = {};
    window.addEventListener('keydown', this.OnKeyDown);
    window.addEventListener('keyup', this.OnKeyUp);
    window.addEventListener('mousewheel', this.OnMouseWheel);
    window.addEventListener('pointermove', this.OnMouseMove);
    window.addEventListener('mousedown', this.OnMouseDown);
    window.addEventListener('mouseup', this.OnMouseUp);
  }

  public static StopListening() {
    window.removeEventListener('keydown', this.OnKeyDown);
    window.removeEventListener('keyup', this.OnKeyUp);
    window.removeEventListener('mousewheel', this.OnMouseWheel);
    window.removeEventListener('pointermove', this.OnMouseMove);
    window.removeEventListener('mousedown', this.OnMouseDown);
    window.removeEventListener('mouseup', this.OnMouseUp);
    Input.Keys = {};
  }

  public static IsKeyDown(key: string): boolean {
    if (Input.Keys === undefined) Input.Keys = {};

    return Input.Keys[key] !== undefined ? Input.Keys[key] : false;
  }

  public static IsMouseButtonDown(mouseButton: MouseButton): boolean {
    if (Input.Keys[mouseButton] === undefined) return false;

    // TODO BUGGED

    return Input.Keys[mouseButton];
  }

  public static GetMousePosition(): THREE.Vector2 {
    return Input._mousePosition;
  }

  protected static OnMouseMove(e): void {
    const xPos = e.clientX;
    const yPos = e.clientY;

    Input._mousePosition = new THREE.Vector2(xPos, yPos);
  }

  protected static OnMouseDown(e): void {
    const buttonId = e.button;
    const mouseButton = Input.MouseButtons[buttonId];
    Input.Keys[mouseButton] = true;
    Input.OnMouseButtonPressed.Invoke({ mouseButton: mouseButton });
  }

  protected static OnMouseUp(e): void {
    const buttonId = e.button;
    const mouseButton = Input.MouseButtons[buttonId];
    Input.Keys[mouseButton] = false;
    Input.OnMouseButtonReleased.Invoke({ mouseButton: mouseButton });
  }

  protected static OnKeyDown(e: KeyboardEvent): void {
    if (document.pointerLockElement !== null) {
      e.preventDefault();
    }

    const keyCode = e.code;
    Input.Keys[keyCode] = true;
    Input.OnKeyPressed.Invoke(keyCode);
  }
  protected static OnMouseWheel(e): void {
    const wheelDelta: number = e.wheelDeltaY;

    Message.Send('MOUSE_WHEEL', {
      wheelDelta: wheelDelta
    });
    Input._mouseWheelDelta = wheelDelta;
  }

  protected static OnKeyUp(e: KeyboardEvent): void {
    if (document.pointerLockElement !== undefined) e.preventDefault();

    const keyCode = e.code;
    Input.Keys[keyCode] = false;
    Input.OnKeyReleased.Invoke(keyCode);
  }
}
