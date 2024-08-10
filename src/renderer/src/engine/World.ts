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
import IHitResult from './HitResult';
import SceneComponent from './SceneComponent';
import TestCylinder from './TestCylinder';
import BillboardActor from './BillboardActor';
import Rotator from './Rotator';
import PointLightActor from './PointLightActor';
import SpotlightActor from './SpotlightActor';

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

    this._testCube = this.Spawn(TestCubeActor);
    this._testCube.SetActorLocation(new THREE.Vector3(-2, 0.5, -2));

    const gridTexture = new Texture2d('src/assets/textures/default_grid.png');
    gridTexture.SetRepeat(4, 4);
    const floorMaterial = new THREE.MeshStandardMaterial({ map: gridTexture.Data });
    this._floor = this.Spawn(StaticMeshActor, 'floor');
    const smc = this._floor.GetComponentOfType(StaticMeshComponent);
    smc?.SetStaticMesh(StaticMesh.FromBox(10, 1, 10, floorMaterial));
    smc?.GetStaticMesh()?.GetRenderMesh().position.setY(-0.51);

    const cyl = this.Spawn(TestCylinder);
    cyl.SetActorLocation(new THREE.Vector3(2, 1, 2));

    this._sun = this.Spawn(DirectionalLightActor, 'Sun');
    this._sun.SetActorLocation(new THREE.Vector3(0, 8, 0));
    this._sun.SetActorRotation(new Rotator(0, 90, 0));

    this._skylight = this.Spawn(SkyLightActor, 'SkyLight');
    this._skylight.SetActorLocation(new THREE.Vector3(0, 6, 0));

    this.Spawn(PointLightActor).SetActorLocation(new THREE.Vector3(1, 1, 1));
    this.Spawn(SpotlightActor).SetActorLocation(new THREE.Vector3(-1, 1, -1));

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

    actor.Load();

    return actor;
  }

  public Remove(actor: Actor) {
    this._actors = this._actors.filter((a) => a !== actor);
  }

  public MultiLineTrace(viewportPos: THREE.Vector2, strictMode: boolean = true): IHitResult[] {
    const raycaster = new THREE.Raycaster();
    const ndcPos = window.Editor.ToViewportNDC(viewportPos);
    raycaster.setFromCamera(ndcPos, window.Camera);

    const children = this.GetRenderScene().children;
    const intersects = raycaster.intersectObjects(children);

    const hitResults: IHitResult[] = [];

    for (let intersect of intersects) {
      const hitOwnerComponent = intersect.object['owner'] as SceneComponent;

      if (hitOwnerComponent.AllowHitTesting() || !strictMode) {
        if (hitOwnerComponent !== undefined) {
          const hitActor = hitOwnerComponent.GetOwner();
          if (hitActor !== undefined && hitActor !== null) {
            hitResults.push({
              actor: hitActor,
              component: hitOwnerComponent,
              position: intersect.point,
              distance: intersect.distance,
              renderObject: intersect.object
            });
          }
        }
      }
    }

    return hitResults;
  }

  public LineTraceSingle(viewportPos: THREE.Vector2): IHitResult {
    const hits = this.MultiLineTrace(viewportPos);
    return hits.length > 0 ? hits[0] : {};
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
