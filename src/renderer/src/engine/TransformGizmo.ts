import Actor from './Actor';
import { StaticMesh } from './StaticMesh';
import StaticMeshComponent from './StaticMeshComponent';

import * as THREE from 'three';

export default class TransformGizmoActor extends Actor {
  protected _gizmoMeshComponent: StaticMeshComponent;

  constructor() {
    super();

    this._gizmoMeshComponent = this.AddComponent(StaticMeshComponent);
  }

  public async Load(): Promise<void> {
    super.Load();

    StaticMesh.FromGLTF('src/assets/models/gizmo.glb', (staticMesh) => {
      this._gizmoMeshComponent.SetStaticMesh(staticMesh);

      const renderMesh = staticMesh.GetRenderMesh();
      renderMesh.position.y += 3;

      const matColors = [0xffffff, 0x0000ff, 0x00ff00, 0xff0000];

      for (let i = 0; i < matColors.length; i++) {
        (renderMesh.children[i] as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          color: matColors[i]
        });
      }
    });
  }
}
