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
    if (this._componentName !== undefined) {
      this._component = window.Editor.GetEdPanel(this._componentName);
    }

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
    let data: {} = this.SerializeToObject();
    console.log(data);
    return JSON.stringify(data);
  }

  protected SerializeToObject(): {} {
    let data = {};
    data['componentName'] = this._componentName;
    data['direction'] = this._direction;
    data['sizes'] = this._sizes;

    if (this.HasSplit()) {
      let children: {}[] = [];
      this._children.forEach((child) => {
        children.push(child.SerializeToObject());
      });

      data['children'] = children;
    }

    return data;
  }

  public Deserialize(data: string): boolean {
    let dataObj = JSON.parse(data);

    this._componentName = dataObj['componentName'];

    this._direction = dataObj['direction'];
    this._sizes = dataObj['sizes'];

    if (dataObj['children'] !== undefined) {
      const children = dataObj['children'];

      const childA = children[0];
      const childB = children[1];

      let sideA = new EditorLayoutPane();
      if (!sideA.Deserialize(JSON.stringify(childA))) return false;

      let sideB = new EditorLayoutPane();
      if (!sideB.Deserialize(JSON.stringify(childB))) return false;

      this.Split(this._direction!, sideA, sideB);
    }

    return true;
  }
}
