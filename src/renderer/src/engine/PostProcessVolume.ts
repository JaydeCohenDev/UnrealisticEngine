import Actor from './Actor';
import PostProcessComponent from './PostProcessComponent';

export default class PostProcessVolume extends Actor {
  protected _postProcessComponent: PostProcessComponent;

  constructor() {
    super();

    this._postProcessComponent = this.AddComponent(PostProcessComponent);
  }
}
