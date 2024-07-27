export class EditorLayout {
  protected _basePanel: EditorLayoutPanel;

  constructor() {
    this._basePanel = new EditorLayoutPanel();
  }

  public OpenPanel(panel: EditorLayoutPanel): void {}
}

export class EditorLayoutPanel {
  protected _leftSplit?: EditorLayoutPanel;
  protected _rightSplit?: EditorLayoutPanel;

  constructor() {}

  public Split(): void {}

  public HasSplit(): boolean {
    return this._leftSplit !== undefined || this._rightSplit !== undefined;
  }
}
