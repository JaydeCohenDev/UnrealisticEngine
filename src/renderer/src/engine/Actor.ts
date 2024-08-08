import { Vector3 } from 'three';
import ActorComponent from './ActorComponent';
import { SubclassOf } from './Class';
import World from './World';
import SceneComponent from './SceneComponent';
import Rotator from './Rotator';

type Constructor<T> = new (...args: any[]) => T;

export default class Actor {
  private static NEXT_ACTOR_ID = 1;
  protected UID: number;
  protected _components: ActorComponent[] = [];
  protected _world?: World;
  protected _customName: string;

  protected constructor() {
    this.UID = Actor.NEXT_ACTOR_ID++;

    this._customName = this.constructor.name;
  }

  public async Load(): Promise<void> {}

  public AllowEditorSelection(): boolean {
    return true;
  }

  public ShowInOutliner(): boolean {
    return true;
  }

  public SetWorld(newWorld: World): void {
    this._world = newWorld;
  }

  public GetWorld(): World | undefined {
    return this._world;
  }

  public GetActorLocation(): Vector3 {
    const root = this.GetRootComponent() as SceneComponent;

    if (root !== undefined) {
      return root.GetWorldLocation();
    }

    return new Vector3(0, 0, 0);
  }

  public SetActorLocation(newLocation: Vector3) {
    const root = this.GetRootComponent() as SceneComponent;

    if (root !== undefined) {
      return root.SetWorldLocation(newLocation);
    }
  }

  public SetActorRotation(newRotation: Rotator) {
    const root = this.GetRootComponent() as SceneComponent;

    if (root !== undefined) {
      return root.SetWorldRotation(newRotation);
    }
  }

  public GetForwardVector(): Vector3 {
    let forwardVector: Vector3 = new Vector3();

    const root = this.GetRootComponent() as SceneComponent;

    if (root !== undefined) {
      root.GetRenderObject().getWorldDirection(forwardVector);
      return forwardVector;
    }

    return new Vector3(0, 0, 1);
  }

  public GetRightVector(): Vector3 {
    const root = this.GetRootComponent() as SceneComponent;

    if (root !== undefined) {
      return new Vector3(1, 0, 0).applyQuaternion(root.GetRenderObject().quaternion);
    }

    return new Vector3(1, 0, 0);
  }

  public GetUpVector(): Vector3 {
    const root = this.GetRootComponent() as SceneComponent;

    if (root !== undefined) {
      return new Vector3(0, 1, 0).applyQuaternion(root.GetRenderObject().quaternion);
    }

    return new Vector3(0, 1, 0);
  }

  public Rename(newName: string) {
    this._customName = newName;
  }

  public GetDisplayName(): string {
    return `${this._customName} [${this.UID}]`;
  }

  public AddComponent<T extends ActorComponent>(componentClass: SubclassOf<ActorComponent>): T {
    var component = new componentClass();
    this._components.push(component);
    component.SetOwner(this);

    return component as T;
  }

  public RemoveComponent(component: ActorComponent): Actor {
    const newComponentList = this._components.filter((c) => {
      return c !== component;
    });

    component.SetOwner(null);
    this._components = newComponentList;
    return this;
  }

  public GetAllComponents(): ActorComponent[] {
    return this._components;
  }

  public GetComponentOfType<T extends ActorComponent>(
    componentType: Constructor<T>
  ): T | undefined {
    return this._components.find((c) => {
      return c instanceof componentType;
    }) as T;
  }

  public GetRootComponent(): ActorComponent | undefined {
    if (this._components.length == 0) return undefined;

    return this._components[0];
  }

  public BeginPlay(): void {
    this._components.forEach((component) => {
      component.BeginPlay();
    });
  }

  public EndPlay(): void {
    this._components.forEach((component) => {
      component.EndPlay();
    });
  }

  public Tick(_deltaTime: number): void {
    this._components.forEach((component) => {
      component.Tick(_deltaTime);
    });
  }

  public Destroy(): void {
    this._components.forEach((component) => {
      component.Destroy();
    });

    this.EndPlay();
    this.GetWorld()?.Remove(this);
  }
}
