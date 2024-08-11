import Actor from './Actor';
import { UClass } from './Decorators';
import StaticMeshComponent from './StaticMeshComponent';

@UClass()
export default class StaticMeshActor extends Actor {
  protected _staticMeshComponent: StaticMeshComponent;

  constructor() {
    super();

    this._staticMeshComponent = this.AddComponent(StaticMeshComponent);
  }
}
