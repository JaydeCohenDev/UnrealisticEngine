import Actor from './Actor';
import { StaticMesh } from './StaticMesh';
import StaticMeshComponent from './StaticMeshComponent';

export default class TransformGizmoActor extends Actor {
  protected _gizmoMeshComponent: StaticMeshComponent;

  constructor() {
    super();

    this._gizmoMeshComponent = this.AddComponent(StaticMeshComponent);
    const staticMesh = StaticMesh.FromGLTF('src/assets/models/gizmo.glb');

    // TODO: gltf load order off so function not returning data correctly

    this._gizmoMeshComponent.SetStaticMesh(staticMesh);
  }
}
