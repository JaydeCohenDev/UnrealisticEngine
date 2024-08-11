//import BillboardComponent from './BilloardComponent';
import { UClass } from './Decorators';
import PostProcessComponent from './PostProcessComponent';
import VolumeActor from './VolumeActor';

@UClass()
export default class PostProcessVolume extends VolumeActor {
  protected _postProcessComponent: PostProcessComponent;

  constructor() {
    super();

    this._postProcessComponent = this.AddComponent(PostProcessComponent);
  }
}
