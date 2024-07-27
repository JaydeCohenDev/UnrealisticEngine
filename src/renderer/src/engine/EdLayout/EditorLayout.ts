import { stringify, parse } from 'flatted';
import ISerializable from '../ISerializable';

export class EditorLayout implements ISerializable {
  protected _rootPane: EditorLayoutPane;

  constructor() {
    this._rootPane = new EditorLayoutPane();
  }

  public GetRootPane(): EditorLayoutPane {
    return this._rootPane;
  }

  public Serialize(): string {
    return this._rootPane.Serialize();
  }

  public Deserialize(data: string): boolean {
    return this._rootPane.Deserialize(data);
  }
}

export class EditorLayoutPane implements ISerializable {
  protected _component?: () => JSX.Element;
  protected _componentName?: string;
  protected _children: EditorLayoutPane[] = [];
  protected _direction?: 'horizontal' | 'vertical';
  protected _sizes: number[] | undefined;
  protected _parent?: EditorLayoutPane;

  constructor(component?: () => JSX.Element) {
    this._component = component;

    if (component !== undefined) {
      this._componentName = component.name;
    }
  }

  public WhenResized(sizes: number[]): void {
    this._sizes = sizes;
  }

  public async Load() {
    if (this._componentName === undefined) return;

    this._component = window.Editor.GetEdPanel(this._componentName);

    if (this.HasSplit()) {
      await this.GetContentInSlot(0).Load();
      await this.GetContentInSlot(1).Load();
    }
  }

  public Split(
    direction: 'horizontal' | 'vertical',
    sideA: EditorLayoutPane,
    sideB: EditorLayoutPane
  ): EditorLayoutPane {
    this._direction = direction;

    this._children[0] = sideA;
    sideA._parent = this;
    this._children[1] = sideB;
    sideB._parent = this;

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

  public GetSizes(): number[] | undefined {
    return this._sizes;
  }

  public Serialize(): string {
    return stringify(this);

    let data = {};
    data['componentName'] = JSON.stringify(this._componentName);
    data['direction'] = JSON.stringify(this._direction);
    data['sizes'] = JSON.stringify(this._sizes);

    if (this.HasSplit()) {
      let children: string[] = [];
      this._children.forEach((child) => {
        children.push(child.Serialize());
      });

      data['children'] = JSON.stringify(children);
    }

    return JSON.stringify(data);
  }

  public Deserialize(data: string): boolean {
    Object.assign(this, parse(data));
    return true;

    let dataObj = JSON.parse(data);

    this._componentName = dataObj['componentName'];
    this._direction = dataObj['direction'];
    this._sizes = dataObj['sizes'];

    if (dataObj['children'] !== undefined) {
      let sideA = new EditorLayoutPane();
      sideA.Deserialize(dataObj['children'][0]);

      let sideB = new EditorLayoutPane();
      sideB.Deserialize(dataObj['children'][1]);

      this.Split(this._direction!, sideA, sideB);
    }

    return true;
  }
}
