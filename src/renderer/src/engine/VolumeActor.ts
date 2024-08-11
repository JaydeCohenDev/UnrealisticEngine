import Actor from './Actor';
import BoxComponent from './BoxComponent';
import { UClass } from './Decorators';

@UClass()
export default class VolumeActor extends Actor {
  protected _boxComponent: BoxComponent;

  constructor() {
    super();

    this._boxComponent = this.AddComponent(BoxComponent);
  }
}
