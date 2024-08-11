import Actor from './Actor';
import BillboardComponent from './BilloardComponent';
import { UClass } from './Decorators';

@UClass()
export default class BillboardActor extends Actor {
  protected _billboardComponent: BillboardComponent;

  constructor() {
    super();

    this._billboardComponent = this.AddComponent(BillboardComponent);
  }
}
