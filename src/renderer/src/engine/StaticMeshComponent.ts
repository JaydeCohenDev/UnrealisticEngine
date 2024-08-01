import SceneComponent from './SceneComponent';
import { StaticMesh } from './StaticMesh';

export default class StaticMeshComponent extends SceneComponent {
  protected _staticMesh?: StaticMesh;
  protected _castShadow: boolean = true;
  protected _receiveShadow: boolean = true;

  public SetStaticMesh(newStaticMesh: StaticMesh): void {
    this._staticMesh = newStaticMesh;
    this._staticMesh.GetRenderMesh()['owner'] = this;
    this._staticMesh.GetRenderMesh().castShadow = this._castShadow;
    this._staticMesh.GetRenderMesh().receiveShadow = this._receiveShadow;

    const world = this.GetWorld();
    if (world !== undefined && this._staticMesh !== undefined) {
      world.GetRenderScene().remove(this._staticMesh.GetRenderMesh());
      world.GetRenderScene().add(this._staticMesh.GetRenderMesh());
    }
  }

  public GetStaticMesh(): StaticMesh | undefined {
    return this._staticMesh;
  }

  public BeginPlay(): void {
    super.BeginPlay();

    const world = this.GetWorld();

    if (world !== undefined && this._staticMesh !== undefined) {
      world.GetRenderScene().add(this._staticMesh.GetRenderMesh());
    }
  }

  public EndPlay(): void {
    super.EndPlay();

    const world = this.GetWorld();

    if (world !== undefined && this._staticMesh !== undefined) {
      world.GetRenderScene().remove(this._staticMesh.GetRenderMesh());
    }
  }
}
