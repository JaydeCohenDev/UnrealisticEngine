import { MeshStandardMaterial } from 'three';
import { StaticMesh } from './StaticMesh';
import StaticMeshActor from './StaticMeshActor';

export default class TestCubeActor extends StaticMeshActor {
  protected hue: number = 0;

  constructor() {
    super();

    const staticMeshAsset = new StaticMesh();
    this._staticMeshComponent.SetStaticMesh(staticMeshAsset);
  }

  public BeginPlay(): void {
    super.BeginPlay();

    const mesh = this._staticMeshComponent.GetStaticMesh();
    if (mesh !== undefined) {
      // TODO: should be set via editor
      // TODO: should just be able to set actor position
      mesh.GetRenderMesh().position.y += 2;
    }
  }

  public Tick(_deltaTime: number): void {
    super.Tick(_deltaTime);

    const mesh = this._staticMeshComponent.GetStaticMesh();
    if (mesh !== undefined) {
      mesh.GetRenderMesh().rotation.x += 0.00562;
      mesh.GetRenderMesh().rotation.y += 0.00353;
      mesh.GetRenderMesh().rotation.z += 0.00621;

      this.hue += 0.00025;
      this.hue %= 1;

      const mat = mesh.GetRenderMesh().material as MeshStandardMaterial;
      mat.color.setHSL(this.hue, 1, 0.5);
    }
  }
}