export type UEventCallback = (payload: any) => void;

export default class UEvent {
  protected _listeners: UEventCallback[] = [];

  public AddListener(callback: UEventCallback): void {
    this.RemoveListener(callback);
    this._listeners.push(callback);
  }

  public RemoveListener(callback: UEventCallback): void {
    this._listeners = this._listeners.filter((c) => {
      return c == callback;
    });
  }

  public Invoke(payload: any): void {
    this._listeners.forEach((callback) => {
      callback(payload);
    });
  }
}
