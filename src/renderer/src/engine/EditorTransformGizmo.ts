import Actor from './Actor';
import StaticMeshComponent from './StaticMeshComponent';
import EditorTransformGizmoComponent from './EditorTransformGizmoComponent';
import UEvent from './UEvent';

export default class EditorTransformGizmo extends Actor {
  public OnTransformSpaceChanged: UEvent = new UEvent();

  protected _transformGizmoComponent: EditorTransformGizmoComponent;

  constructor() {
    super();

    this._transformGizmoComponent = this.AddComponent(EditorTransformGizmoComponent);
  }

  public BeginPlay(): void {
    super.BeginPlay();
    this._transformGizmoComponent.TransformGizmo.addEventListener('space-changed', (e) => {
      this.OnTransformSpaceChanged.Invoke(e);
    });
  }

  public EndPlay(): void {
    super.EndPlay();
  }

  public IsLocalSpace(): boolean {
    return this._transformGizmoComponent.TransformGizmo.space === 'local';
  }

  public SetIsLocalSpace(setLocalSpace: boolean): void {
    this._transformGizmoComponent.TransformGizmo.space = setLocalSpace ? 'local' : 'world';
  }

  public ShowInOutliner(): boolean {
    return false;
  }

  public AttachTo(actor: Actor) {
    const smc = actor.GetComponentOfType(StaticMeshComponent);
    if (smc) {
      this._transformGizmoComponent.TransformGizmo.attach(smc.GetStaticMesh()!.GetRenderMesh());
    }
  }
}
