import { EditorLayout, EditorLayoutPane } from './EdLayout/EditorLayout';
import Viewport from '@renderer/components/Viewport/Viewport';
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
import EditorTransformGizmo from './EditorTransformGizmo';
import { ViewportSettings } from './ViewportOptions';
import Reflection from './Reflection';
import UClass from './UClass';

type ReactComponent = () => JSX.Element;

export default class Editor {
  public OnActorSelectionSetChanged: UEvent = new UEvent();
  public OnTransformSpaceChanged: UEvent = new UEvent();
  public OnSpawnableActorsUpdated: UEvent = new UEvent();

  protected _layout: EditorLayout;
  protected _registeredEditorPanels: { [id: string]: () => JSX.Element } = {};
  protected _world: World;

  protected _viewportPawn: ViewportEditorPawn;

  protected _allowActorSelection: boolean = true;

  protected _transformActor?: Actor;
  protected _transformGizmo?: EditorTransformGizmo;

  protected _registeredPropertyViews: { [id: string]: (props: IPropertyViewProps) => JSX.Element } =
    {};

  protected _selectedActors: Actor[] = [];

  public ViewportSettings: ViewportSettings = {
    transformSpace: 'world',
    enablePositionSnapping: false,
    enableRotationSnapping: false,
    enableScaleSnapping: false
  };

  constructor() {
    this._world = new World('editor world');
    this._layout = new EditorLayout();

    this._viewportPawn = this._world.Spawn(ViewportEditorPawn);

    this.RegisterEdPanels([Viewport, ContentBrowser, Outliner, DetailsPanel]);

    this.RegisterPropertyView('number', NumberPropertyView);
    this.RegisterPropertyView('string', TextPropertyView);
    this.RegisterPropertyView(THREE.Color.name, ColorPropertyView);
    this.RegisterPropertyView('boolean', BooleanPropertyView);

    Input.OnKeyPressed.AddListener((e) => {
      switch (e) {
        case 'Escape':
          this.SetSelectedActors([]);
          break;
        case 'Delete':
          this.DeleteSelectedActors();
          break;
      }
    });

    Reflection.OnUClassRegistryUpdate.AddListener((e) => {
      this.OnSpawnableActorsUpdated.Invoke(undefined);
    });
  }

  public get AllowActorSelection(): boolean {
    return this._allowActorSelection;
  }

  public set AllowActorSelection(newVal: boolean) {
    this._allowActorSelection = newVal;
  }

  public get TransformGizmo(): EditorTransformGizmo | undefined {
    return this._transformGizmo;
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

  public SetTransformActor(actor?: Actor) {
    if (actor === this._transformActor) return;

    this.ClearTransformActor();
    if (actor === undefined) return;
    this._transformActor = actor;

    this._transformGizmo = this.GetWorld().Spawn(EditorTransformGizmo);
    this._transformGizmo.AttachTo(actor);
    this._transformGizmo.OnTransformSpaceChanged.AddListener((e) => {
      this.OnTransformSpaceChanged.Invoke(e);
    });
  }

  public ClearTransformActor() {
    this._transformActor = undefined;
    this._transformGizmo?.Destroy();
  }

  public DeleteSelectedActors(): void {
    this._selectedActors.forEach((selectedActor) => {
      this._world.Remove(selectedActor);
    });
    this.SetSelectedActors([]);
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

  public GetSpawnableActorClasses(): UClass[] {
    return Reflection.GetClasses().filter((uclass) => {
      return uclass.IsChildClassOf(Actor);
    });
  }

  public SetSelectedActors(actors: Actor[]): void {
    this._selectedActors.forEach((actor) => {
      actor.DeselectedInEditor();
    });

    this._selectedActors = actors.filter((actor) => {
      return actor.AllowEditorSelection();
    });

    this._selectedActors.forEach((actor) => {
      actor.SelectedInEditor();
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
        //outlinePass.selectedObjects = selectedObjs;
      }
    }

    this.SetTransformActor(this._selectedActors[0]);

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
    // const layoutData = this._layout.Serialize();
    // localStorage.setItem('edLayout', layoutData);
    // alert('layout saved!');
  }

  public ResetLayout(): void {
    return;
    // this._layout = new EditorLayout();
    // this._layout
    //   .GetRootPane()
    //   .Split(
    //     'horizontal',
    //     new EditorLayoutPane().Split(
    //       'vertical',
    //       new EditorLayoutPane(Viewport),
    //       new EditorLayoutPane(ContentBrowser)
    //     ),
    //     new EditorLayoutPane().Split(
    //       'vertical',
    //       new EditorLayoutPane(Outliner),
    //       new EditorLayoutPane(DetailsPanel)
    //     )
    //   );

    // window.ForceUpdate(); // doesnt work?
  }
}
