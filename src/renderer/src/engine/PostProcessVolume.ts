//import BillboardComponent from './BilloardComponent';
import PostProcessComponent from './PostProcessComponent';
import VolumeActor from './VolumeActor';

export default class PostProcessVolume extends VolumeActor {
  protected _postProcessComponent: PostProcessComponent;

  constructor() {
    super();

    this._postProcessComponent = this.AddComponent(PostProcessComponent);
  }
}
