import ActorComponent from './ActorComponent';

export default class SceneComponent extends ActorComponent {
  public AllowHitTesting(): boolean {
    return true;
  }
}
