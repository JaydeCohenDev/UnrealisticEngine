import Actor from './Actor';
import World from './World';

export default abstract class ActorComponent {
  protected static NEXT_ID = 1;

  protected Owner: Actor | null = null;
  protected _id: number;

  constructor() {
    this._id = ActorComponent.NEXT_ID;
    ActorComponent.NEXT_ID++;
  }

  public get Id(): number {
    return this._id;
  }

  public SetOwner(newOwner: Actor | null): void {
    this.Owner = newOwner;
  }

  public GetOwner(): Actor | null {
    return this.Owner;
  }

  public Destroy(): void {
    this.EndPlay();
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
