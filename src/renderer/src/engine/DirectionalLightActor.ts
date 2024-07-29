import Actor from './Actor';
import DirectionalLightComponent from './DirectionalLightComponent';

export class DirectionalLightActor extends Actor {
  protected _directionalLightComponent: DirectionalLightComponent;

  constructor() {
    super();

    this._directionalLightComponent = this.AddComponent(DirectionalLightComponent);
  }
}
