import { EditorLayout, EditorLayoutPane } from './EdLayout/EditorLayout';
import Viewport from '@renderer/components/Viewport';
import ContentBrowser from '@renderer/components/ContentBrowser';
import Outliner from '@renderer/components/Outliner';
import DetailsPanel from '@renderer/components/DetailsPanel';
import World from './World';
import ViewportEditorPawn from './ViewportEditorPawn';

type ReactComponent = () => JSX.Element;

export default class Editor {
  protected _layout: EditorLayout;
  protected _registeredEditorPanels: { [id: string]: () => JSX.Element } = {};
  protected _world: World;

  protected _viewportPawn: ViewportEditorPawn;

  constructor() {
    this._world = new World('editor world');
    this._layout = new EditorLayout();

    this._viewportPawn = this._world.Spawn(ViewportEditorPawn);

    this.RegisterEdPanels([Viewport, ContentBrowser, Outliner, DetailsPanel]);
  }

  public async Load() {
    const loadedLayoutString = localStorage.getItem('edLayout');
    let forceReset = false;
    if (loadedLayoutString !== null && !forceReset) {
      this._layout = new EditorLayout();
      this._layout.Deserialize(loadedLayoutString);

      await this._layout.GetRootPane().Load();
    } else {
      this.ResetLayout();
    }
  }

  protected RegisterEdPanels(components: ReactComponent[]) {
    components.forEach((component) => {
      this.RegisterEdPanel(component);
    });
  }

  protected RegisterEdPanel(component: ReactComponent) {
    this._registeredEditorPanels[component.name] = component;
  }

  public GetEdPanel(panelName: string): ReactComponent | undefined {
    return this._registeredEditorPanels[panelName];
  }

  public GetLayout(): EditorLayout {
    return this._layout;
  }

  public GetWorld(): World {
    return this._world;
  }

  public SaveLayout(): void {
    const layoutData = this._layout.Serialize();
    localStorage.setItem('edLayout', layoutData);
    alert('layout saved!');
  }

  public ResetLayout(): void {
    this._layout = new EditorLayout();
    this._layout
      .GetRootPane()
      .Split(
        'horizontal',
        new EditorLayoutPane().Split(
          'vertical',
          new EditorLayoutPane(Viewport),
          new EditorLayoutPane(ContentBrowser)
        ),
        new EditorLayoutPane().Split(
          'vertical',
          new EditorLayoutPane(Outliner),
          new EditorLayoutPane(DetailsPanel)
        )
      );

    window.ForceUpdate(); // doesnt work?
  }
}
