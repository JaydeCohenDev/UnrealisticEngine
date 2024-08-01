import Message from './Message';

export default class Input {
  protected static Keys: { [id: string]: boolean } = {};

  public static StartListening() {
    Input.Keys = {};
    window.addEventListener('keydown', this.OnKeyDown);
    window.addEventListener('keyup', this.OnKeyUp);
    window.addEventListener('mousewheel', this.OnMouseWheel);
  }

  public static StopListening() {
    window.removeEventListener('keydown', this.OnKeyDown);
    window.removeEventListener('keyup', this.OnKeyUp);
    window.removeEventListener('mousewheel', this.OnMouseWheel);
    Input.Keys = {};
  }

  public static IsKeyDown(key: string): boolean {
    if (Input.Keys === undefined) Input.Keys = {};

    return Input.Keys[key] !== undefined ? Input.Keys[key] : false;
  }

  protected static OnKeyDown(e: KeyboardEvent): void {
    //e.preventDefault(); // breaks text input in details panel

    const keyCode = e.code;
    Input.Keys[keyCode] = true;
  }

  protected static OnMouseWheel(e): void {
    const wheelDelta: number = e.wheelDeltaY;

    Message.Send('MOUSE_WHEEL', {
      wheelDelta: wheelDelta
    });
  }

  protected static OnKeyUp(e: KeyboardEvent): void {
    e.preventDefault();

    const keyCode = e.code;
    Input.Keys[keyCode] = false;
  }
}
