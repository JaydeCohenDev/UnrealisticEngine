import Actor from './Actor';
import { SubclassOf } from './Class';
import * as THREE from 'three';
import TestCubeActor from './TestCubeActor';
import { DirectionalLightActor } from './DirectionalLightActor';
import SkyLightActor from './SkyLightActor';

export default class World {
  protected _name: string;
  protected _actors: Actor[] = [];

  protected _testCube: TestCubeActor;
  protected _sun: DirectionalLightActor;
  protected _skylight: SkyLightActor;

  protected _floorMesh: THREE.Mesh;

  protected _scene: THREE.Scene;

  constructor(name: string) {
    console.log('world created');

    this._name = name;

    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color('#e8f7fc');

    this._testCube = this.Spawn(TestCubeActor);

    this._floorMesh = this.CreateFloor();
    this._scene.add(this._floorMesh);

    this._sun = this.Spawn(DirectionalLightActor, 'Sun');

    this._skylight = this.Spawn(SkyLightActor, 'SkyLight');
  }

  public GetAllActors(): Actor[] {
    return this._actors;
  }

  protected CreateFloor(): THREE.Mesh {
    const gridTexture = new THREE.TextureLoader().load('src/assets/textures/default_grid.png');
    gridTexture.wrapS = THREE.RepeatWrapping;
    gridTexture.wrapT = THREE.RepeatWrapping;
    gridTexture.repeat.set(4, 4);

    const geometry = new THREE.BoxGeometry(10, 1, 10, 10, 1, 10);
    const material = new THREE.MeshStandardMaterial({ map: gridTexture });
    const ground = new THREE.Mesh(geometry, material);

    ground.position.y += 0.5;
    ground.receiveShadow = true;
    ground.castShadow = true;

    return ground;
  }

  protected CreateSkylight(): THREE.AmbientLight {
    return new THREE.AmbientLight(0xffffff, 0.5);
  }

  public Spawn<T extends Actor>(actorClass: SubclassOf<T>, name?: string): T {
    const actor = new actorClass();
    this._actors.push(actor);
    actor.SetWorld(this);

    if (name !== undefined) {
      actor.Rename(name);
    }

    actor.BeginPlay();

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
