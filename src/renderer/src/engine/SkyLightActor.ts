import Actor from './Actor';
import SkyLightComponent from './SkyLightComponent';

export default class SkyLightActor extends Actor {
  protected _skyLightComponent: SkyLightComponent;

  constructor() {
    super();

    this._skyLightComponent = this.AddComponent(SkyLightComponent);
  }
}
