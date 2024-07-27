import Actor from './Actor';
import { SubclassOf } from './Class';

export default class World {
  protected _name: string;
  protected _actors: Actor[] = [];

  constructor(name: string) {
    this._name = name;
  }

  public Spawn<T extends Actor>(actorClass: SubclassOf<T>): T {
    const actor = new actorClass();
    this._actors.push(actor);
    actor.SetWorld(this);

    return actor;
  }
}
