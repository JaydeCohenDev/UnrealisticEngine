import Actor from './Actor';
import { SubclassOf } from './Class';
import * as THREE from 'three';
import TestCubeActor from './TestCubeActor';
import { DirectionalLightActor } from './DirectionalLightActor';
import SkyLightActor from './SkyLightActor';
import StaticMeshActor from './StaticMeshActor';
import StaticMeshComponent from './StaticMeshComponent';
import { StaticMesh } from './StaticMesh';
import Texture2d from './Texture2d';
import Message from './Message';
import PostProcessVolume from './PostProcessVolume';

export default class World {
  protected _name: string;
  protected _actors: Actor[] = [];

  protected _testCube: TestCubeActor;
  protected _floor: StaticMeshActor;
  protected _sun: DirectionalLightActor;
  protected _skylight: SkyLightActor;

  protected _scene: THREE.Scene;

  constructor(name: string) {
    console.log('world created');

    this._name = name;

    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color('#e8f7fc');

    this._testCube = this.Spawn(TestCubeActor);

    const gridTexture = new Texture2d('src/assets/textures/default_grid.png');
    const floorMaterial = new THREE.MeshStandardMaterial({ map: gridTexture.Data });
    this._floor = this.Spawn(StaticMeshActor, 'floor');
    const smc = this._floor.GetComponentOfType(StaticMeshComponent);
    smc?.SetStaticMesh(StaticMesh.FromBox(10, 1, 10, floorMaterial));

    this._sun = this.Spawn(DirectionalLightActor, 'Sun');
    this.Spawn(DirectionalLightActor, 'moon');

    this._skylight = this.Spawn(SkyLightActor, 'SkyLight');

    this.Spawn(PostProcessVolume);
  }

  public GetAllActors(): Actor[] {
    return this._actors;
  }

  public Spawn<T extends Actor>(actorClass: SubclassOf<T>, name?: string): T {
    const actor = new actorClass();
    this._actors.push(actor);
    actor.SetWorld(this);

    if (name !== undefined) {
      actor.Rename(name);
    }

    actor.BeginPlay();

    Message.Send('ACTOR_SPAWN', { actor: actor });

    return actor;
  }

  public GetRenderScene(): THREE.Scene {
    return this._scene;
  }

  public Tick(_deltaTime: number): void {
    this._actors.forEach((actor) => {
      actor.Tick(_deltaTime);
    });
  }
}
