export default class RectBounds {
  protected _x: number;
  protected _y: number;
  protected _width: number;
  protected _height: number;

  constructor(x: number, y: number, w: number, h: number) {
    this._x = x;
    this._y = y;
    this._width = w;
    this._height = h;
  }

  public static Empty(): RectBounds {
    return new RectBounds(0, 0, 0, 0);
  }

  public get X(): number {
    return this._x;
  }

  public get Y(): number {
    return this._y;
  }

  public get Width(): number {
    return this._width;
  }

  public get Height(): number {
    return this._height;
  }
}
