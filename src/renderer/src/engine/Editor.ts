import { EditorLayout, EditorLayoutPane } from './EdLayout/EditorLayout';
import Viewport from '@renderer/components/Viewport';
import ContentBrowser from '@renderer/components/ContentBrowser';
import Outliner from '@renderer/components/Outliner/Outliner';
import DetailsPanel from '@renderer/components/DetailsPanel/DetailsPanel';
import World from './World';
import ViewportEditorPawn from './ViewportEditorPawn';
import Actor from './Actor';
import UEvent from './UEvent';
import NumberPropertyView from '@renderer/components/DetailsPanel/Property/NumberPropertyView';
import TextPropertyView from '@renderer/components/DetailsPanel/Property/TextPropertyView';
import * as THREE from 'three';
import ColorPropertyView from '@renderer/components/DetailsPanel/Property/ColorPropertyView';
import BooleanPropertyView from '@renderer/components/DetailsPanel/Property/BooleanPropertyView';
import { IPropertyViewProps } from '@renderer/components/DetailsPanel/Property/PropertyViewBase';
import StaticMeshComponent from './StaticMeshComponent';
import Input from './Input';
import FMath from './FMath';
import RectBounds from './RectBounds';

type ReactComponent = () => JSX.Element;

export default class Editor {
  public OnActorSelectionSetChanged: UEvent = new UEvent();

  protected _layout: EditorLayout;
  protected _registeredEditorPanels: { [id: string]: () => JSX.Element } = {};
  protected _world: World;

  protected _viewportPawn: ViewportEditorPawn;

  protected _registeredPropertyViews: { [id: string]: (props: IPropertyViewProps) => JSX.Element } =
    {};

  protected _selectedActors: Actor[] = [];

  constructor() {
    this._world = new World('editor world');
    this._layout = new EditorLayout();

    this._viewportPawn = this._world.Spawn(ViewportEditorPawn);

    this.RegisterEdPanels([Viewport, ContentBrowser, Outliner, DetailsPanel]);

    this.RegisterPropertyView('number', NumberPropertyView);
    this.RegisterPropertyView('string', TextPropertyView);
    this.RegisterPropertyView(THREE.Color.name, ColorPropertyView);
    this.RegisterPropertyView('boolean', BooleanPropertyView);
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

  public GetViewportBounds(): RectBounds {
    if (window.RenderContext === undefined) return RectBounds.Empty();

    const canvas = window.RenderContext.GetCanvas();

    const viewportWidth = canvas.parentElement!.clientWidth;
    const viewportHeight = canvas.parentElement!.clientHeight;
    const viewportStartX = canvas.parentElement!.getBoundingClientRect().x;
    const viewportStartY = canvas.parentElement!.getBoundingClientRect().y;

    return new RectBounds(viewportStartX, viewportStartY, viewportWidth, viewportHeight);
  }

  public GetMousePositionInViewport(): THREE.Vector2 {
    const cursorPos = Input.GetMousePosition();

    if (window.RenderContext === undefined) return new THREE.Vector2(0, 0);

    const canvas = window.RenderContext.GetCanvas();

    const viewportWidth = canvas.parentElement!.clientWidth;
    const viewportHeight = canvas.parentElement!.clientHeight;
    const viewportStartX = canvas.parentElement!.getBoundingClientRect().x;
    const viewportStartY = canvas.parentElement!.getBoundingClientRect().y;

    const viewportDeltaX = FMath.MapRange(
      cursorPos.x,
      viewportStartX,
      viewportStartX + viewportWidth,
      0,
      viewportWidth
    );
    const viewportDeltaY = FMath.MapRange(
      cursorPos.y,
      viewportStartY,
      viewportStartY + viewportHeight,
      0,
      viewportHeight
    );

    return new THREE.Vector2(viewportDeltaX, viewportDeltaY);
  }

  public GetMousePositionInViewportNDC(): THREE.Vector2 {
    const pos = this.GetMousePositionInViewport();
    return this.ToViewportNDC(pos);
  }

  public ToViewportNDC(pos: THREE.Vector2): THREE.Vector2 {
    const viewportBounds = this.GetViewportBounds();

    return new THREE.Vector2(
      (pos.x / viewportBounds.Width) * 2 - 1,
      -(pos.y / viewportBounds.Height) * 2 + 1
    );
  }

  public SetSelectedActors(actors: Actor[]): void {
    this._selectedActors = actors.filter((actor) => {
      return actor.AllowEditorSelection();
    });

    const selectedObjs: THREE.Object3D[] = [];
    this._selectedActors.forEach((actor) => {
      const smc = actor.GetComponentOfType(StaticMeshComponent);
      if (smc !== undefined) {
        const staticMesh = smc.GetStaticMesh();
        if (staticMesh !== undefined) {
          selectedObjs.push(staticMesh.GetRenderMesh()!);
        }
      }
    });

    if (window.RenderContext !== undefined) {
      const outlinePass = window.RenderContext.PostProcessStack.outlinePass;
      if (outlinePass !== undefined) {
        outlinePass.selectedObjects = selectedObjs;
      }
    }

    this.OnActorSelectionSetChanged.Invoke({ selectedActors: actors });
  }

  public GetSelectedActors(): Actor[] {
    return this._selectedActors;
  }

  public RegisterEdPanels(components: ReactComponent[]) {
    components.forEach((component) => {
      this.RegisterEdPanel(component);
    });
  }

  public RegisterPropertyView(
    typeName: string,
    component: (props: IPropertyViewProps) => JSX.Element
  ): void {
    this._registeredPropertyViews[typeName] = component;
  }

  public GetPropertyViewFor(
    typeName: string
  ): (props: IPropertyViewProps) => JSX.Element | undefined {
    return this._registeredPropertyViews[typeName];
  }

  public RegisterEdPanel(component: ReactComponent) {
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
