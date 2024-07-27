import Actor from './Actor';

export default abstract class ActorComponent {
  protected Owner: Actor | null = null;

  public SetOwner(newOwner: Actor | null): void {
    this.Owner = newOwner;
  }

  public GetOwner(): Actor | null {
    return this.Owner;
  }

  public Destroy(): void {
    if (this.Owner === null) return;

    this.Owner.RemoveComponent(this);
  }
}
