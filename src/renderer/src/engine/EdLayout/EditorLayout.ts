export class EditorLayout {
  protected _rootPane: EditorLayoutPane;

  constructor() {
    this._rootPane = new EditorLayoutPane();
  }

  public GetRootPane(): EditorLayoutPane {
    return this._rootPane;
  }
}

export class EditorLayoutPane {
  protected _component?: () => JSX.Element;
  protected _children: EditorLayoutPane[] = [];
  protected _direction?: 'horizontal' | 'vertical';

  constructor(component?: () => JSX.Element) {
    this._component = component;
  }

  public Split(
    direction: 'horizontal' | 'vertical',
    sideA: EditorLayoutPane,
    sideB: EditorLayoutPane
  ): EditorLayoutPane {
    this._direction = direction;

    this._children[0] = sideA;
    this._children[1] = sideB;

    return this;
  }

  public HasSplit(): boolean {
    return this._children.length > 0;
  }

  public GetSplitDirection(): 'horizontal' | 'vertical' | undefined {
    return this._direction;
  }

  public GetContentInSlot(slot: 0 | 1): EditorLayoutPane {
    return this._children[slot];
  }

  public GetComponent(): () => JSX.Element {
    return this._component!;
  }
}
