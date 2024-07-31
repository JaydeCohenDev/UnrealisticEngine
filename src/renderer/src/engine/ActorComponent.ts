import Actor from './Actor';
import World from './World';

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

  public GetWorld(): World | undefined {
    return this.Owner?.GetWorld();
  }

  public BeginPlay(): void {}
  public EndPlay(): void {}

  public Tick(_deltaTime: number): void {}

  public GetDisplayName(): string {
    return this.constructor.name;
  }
}
