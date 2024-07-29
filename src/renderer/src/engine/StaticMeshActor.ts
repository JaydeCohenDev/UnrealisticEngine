import Actor from './Actor';
import StaticMeshComponent from './StaticMeshComponent';

export default class StaticMeshActor extends Actor {
  protected _staticMeshComponent: StaticMeshComponent;

  constructor() {
    super();

    this._staticMeshComponent = this.AddComponent(StaticMeshComponent);
  }
}
