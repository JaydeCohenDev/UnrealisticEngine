import Actor from './Actor';
import BillboardComponent from './BilloardComponent';
import PostProcessComponent from './PostProcessComponent';

export default class PostProcessVolume extends Actor {
  protected _postProcessComponent: PostProcessComponent;
  protected _billboardComponent: BillboardComponent;

  constructor() {
    super();

    this._billboardComponent = this.AddComponent(BillboardComponent);
    this._postProcessComponent = this.AddComponent(PostProcessComponent);
  }

  public BeginPlay(): void {
    super.BeginPlay();
  }
}
