import Actor from './Actor';
import Input from './Input';
import { StaticMesh } from './StaticMesh';
import StaticMeshComponent from './StaticMeshComponent';

import * as THREE from 'three';

export default class TransformGizmoActor extends Actor {
  protected _gizmoMeshComponent: StaticMeshComponent;

  constructor() {
    super();

    this._gizmoMeshComponent = this.AddComponent(StaticMeshComponent);
  }

  public Tick(_deltaTime: number): void {
    if (Input.IsMouseButtonDown('MOUSE_LEFT')) {
      const world = this.GetWorld();
      if (world === undefined) return;

      const testPos = window.Editor.GetMousePositionInViewport();
      const hit = world.LineTraceSingle(testPos);

      if (hit.actor === this) {
        const staticMesh = this._gizmoMeshComponent.GetStaticMesh();
        if (staticMesh !== undefined) {
          if (hit.renderObject === staticMesh.GetRenderMesh().children[1]) {
            console.log('drag up');
          }
        }
      }
    }
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

  public AllowEditorSelection(): boolean {
    return false;
  }
}
