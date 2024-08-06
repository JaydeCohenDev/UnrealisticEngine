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

  public BeginPlay(): void {
    const scene = this.GetWorld()!.GetRenderScene();
    scene.add(this._transformGizmo);

    window.Editor.AllowActorSelection = false;

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
    window.Editor.AllowActorSelection = true;

    this.GetWorld()!.GetRenderScene().remove(this._transformGizmo);
    this._transformGizmo.reset();
    this._transformGizmo.detach();
    this._transformGizmo.dispose();
  }
}
