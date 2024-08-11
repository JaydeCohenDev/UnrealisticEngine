import { MeshBasicMaterial, Object3D } from 'three';
import SceneComponent from './SceneComponent';
import { StaticMesh } from './StaticMesh';

export default class StaticMeshComponent extends SceneComponent {
  protected _staticMesh?: StaticMesh;
  protected _castShadow: boolean = true;
  protected _receiveShadow: boolean = true;

  public constructor() {
    super();

    this.SetStaticMesh(StaticMesh.FromBox(1, 1, 1, new MeshBasicMaterial()));
  }

  public SetStaticMesh(newStaticMesh: StaticMesh): void {
    if (this._staticMesh !== undefined)
      this.RemoveFromRenderScene(this._staticMesh.GetRenderMesh());

    this._staticMesh = newStaticMesh;

    this._staticMesh.GetRenderMesh().traverse((mesh) => {
      mesh.castShadow = this._castShadow;
      mesh.receiveShadow = this._receiveShadow;
    });

    this.AddToRenderScene(this._staticMesh.GetRenderMesh());
  }

  public GetStaticMesh(): StaticMesh | undefined {
    return this._staticMesh;
  }

  public GetRenderObject(): Object3D {
    return this._staticMesh!.GetRenderMesh();
  }
}
