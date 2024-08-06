import Actor from './Actor';
import StaticMeshComponent from './StaticMeshComponent';
import EditorTransformGizmoComponent from './EditorTransformGizmoComponent';

export default class EditorTransformGizmo extends Actor {
  protected _transformGizmoComponent: EditorTransformGizmoComponent;

  constructor() {
    super();

    this._transformGizmoComponent = this.AddComponent(EditorTransformGizmoComponent);
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
