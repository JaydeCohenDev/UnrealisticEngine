import EditorTransformGizmo from './EditorTransformGizmo';
import Input from './Input';
import SceneComponent from './SceneComponent';
import { TransformControls } from 'three/examples/jsm/addons';

export default class EditorTransformGizmoComponent extends SceneComponent {
  protected _transformGizmo: TransformControls;

  public get TransformGizmo(): TransformControls {
    return this._transformGizmo;
  }

  constructor() {
    super();

    this._transformGizmo = new TransformControls(
      window.Camera,
      window.RenderContext?.GetRenderer().domElement
    );

    this._transformGizmo['owner'] = this;
    this._transformGizmo.traverse((child) => {
      child['owner'] = this;
    });

    this._transformGizmo.space = window.Editor.ViewportSettings.transformSpace;
    this._transformGizmo.translationSnap = window.Editor.ViewportSettings.enablePositionSnapping
      ? 1
      : 0;
    this._transformGizmo.rotationSnap = window.Editor.ViewportSettings.enableRotationSnapping
      ? Math.PI / 4
      : 0;
    this._transformGizmo.setScaleSnap(
      window.Editor.ViewportSettings.enableScaleSnapping ? 0.25 : 0
    );
  }

  public AllowHitTesting(): boolean {
    return false;
  }

  protected IsHoveringTransformGizmo(): boolean {
    const traceLoc = window.Editor.GetMousePositionInViewport();
    const hitResults = window.Editor.GetWorld().MultiLineTrace(traceLoc, false);

    for (let hit of hitResults) {
      if (hit.actor instanceof EditorTransformGizmo) {
        return true;
      }
    }

    return false;
  }

  public Tick(_deltaTime: number): void {
    super.Tick(_deltaTime);

    window.Editor.AllowActorSelection = !this._transformGizmo.dragging;
  }

  public BeginPlay(): void {
    super.BeginPlay();

    const scene = this.GetWorld()!.GetRenderScene();
    scene.add(this._transformGizmo);

    Input.OnKeyPressed.AddListener((keyCode) => {
      if (this._transformGizmo) {
        if (keyCode === 'KeyQ') {
          this._transformGizmo.setSpace(this._transformGizmo.space === 'local' ? 'world' : 'local');
        }
        if (keyCode === 'KeyW') {
          this._transformGizmo.setMode('translate');
        }
        if (keyCode === 'KeyE') {
          this._transformGizmo.setMode('rotate');
        }
        if (keyCode === 'KeyR') {
          this._transformGizmo.setMode('scale');
        }
      }
    });
  }

  public EndPlay(): void {
    super.EndPlay();

    window.Editor.AllowActorSelection = true;

    this.GetWorld()!.GetRenderScene().remove(this._transformGizmo);
    this._transformGizmo.reset();
    this._transformGizmo.detach();
    this._transformGizmo.dispose();
  }
}
