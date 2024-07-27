import ActorComponent from './ActorComponent';

type Constructor<T> = new (...args: any[]) => T;

export default class Actor {
  private static NEXT_ACTOR_ID = 1;
  protected UID: number;
  protected _components: ActorComponent[] = [];

  constructor() {
    this.UID = Actor.NEXT_ACTOR_ID++;
  }

  public AddComponent(component: ActorComponent): Actor {
    this._components.push(component);
    component.SetOwner(this);

    return this;
  }

  public RemoveComponent(component: ActorComponent): Actor {
    const newComponentList = this._components.filter((c) => {
      return c !== component;
    });

    component.SetOwner(null);
    this._components = newComponentList;
    return this;
  }

  public GetComponentOfType(componentType: Constructor<ActorComponent>): ActorComponent | undefined {
    return this._components.find((c) => {
      return c instanceof componentType;
    });
  }
}
