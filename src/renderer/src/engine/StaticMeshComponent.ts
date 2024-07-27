import SceneComponent from './SceneComponent';
import { StaticMesh } from './StaticMesh';

export default class StaticMeshComponent extends SceneComponent {
  protected _staticMesh?: StaticMesh;

  public SetStaticMesh(newStaticMesh: StaticMesh): void {
    this._staticMesh = newStaticMesh;
  }

  public GetStaticMesh(): StaticMesh | undefined {
    return this._staticMesh;
  }
}
