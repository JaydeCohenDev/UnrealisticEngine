import Actor from './Actor';
import BillboardComponent from './BilloardComponent';

export default class BillboardActor extends Actor {
  protected _billboardComponent: BillboardComponent;

  constructor() {
    super();

    this._billboardComponent = this.AddComponent(BillboardComponent);
  }
}
