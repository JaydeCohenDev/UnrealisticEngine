import Actor from './Actor';
import BoxComponent from './BoxComponent';

export default class VolumeActor extends Actor {
  protected _boxComponent: BoxComponent;

  constructor() {
    super();

    this._boxComponent = this.AddComponent(BoxComponent);
  }
}
