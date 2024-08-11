export class EdMenu {
  protected _items: EdMenuItem[] = [];

  public AddItem(newItem: EdMenuItem): EdMenuItem {
    this._items.push(newItem);

    return newItem;
  }

  public GetItems(): EdMenuItem[] {
    return this._items;
  }
}

export class EdMenuItem {
  protected _displayText: string;
  protected _items: EdMenuItem[] = [];
  protected _callback?: () => void;

  constructor(displayText: string, callback?: () => void) {
    this._displayText = displayText;
    this._callback = callback;
  }

  public AddItem(newItem: EdMenuItem): EdMenuItem {
    this._items.push(newItem);

    return newItem;
  }

  public ClearItems(): void {
    this._items = [];
  }

  public GetItems(): EdMenuItem[] {
    return this._items;
  }

  public OnClick(): void {
    if (this._callback !== undefined) this._callback();
  }

  public GetDisplayText(): string {
    return this._displayText;
  }
}
