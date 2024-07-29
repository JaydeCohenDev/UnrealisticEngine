import Actor from './Actor';
import { SubclassOf } from './Class';
import * as THREE from 'three';

export default class World {
  protected _name: string;
  protected _actors: Actor[] = [];

  protected _testCube: THREE.Mesh;

  protected _floorMesh: THREE.Mesh;

  protected _scene: THREE.Scene;

  constructor(name: string) {
    console.log('world created');

    this._name = name;

    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color('#e8f7fc');

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    this._testCube = new THREE.Mesh(geometry, material);
    this._testCube.castShadow = true;
    this._testCube.receiveShadow = true;
    this._testCube.position.y += 2;
    this._scene.add(this._testCube);

    this._floorMesh = this.CreateFloor();
    this._scene.add(this._floorMesh);

    const sun = this.CreateSun();
    this._scene.add(sun);

    const skylight = this.CreateSkylight();
    this._scene.add(skylight);

    // const skybox = this.CreateSkybox();
    // this._scene.add(skybox);

    const helper = new THREE.CameraHelper(sun.shadow.camera);
    this._scene.add(helper);
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

  protected CreateSkybox(): THREE.Mesh {
    const geo = new THREE.BoxGeometry(10000, 10000, 10000);
    const skybox = new THREE.Mesh(geo);
    return skybox;
  }

  protected CreateSun(): THREE.DirectionalLight {
    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(0, 10, 0);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 512;
    sun.shadow.mapSize.height = 512;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 50;
    return sun;
  }

  protected CreateSkylight(): THREE.AmbientLight {
    return new THREE.AmbientLight(0xffffff, 0.5);
  }

  public Spawn<T extends Actor>(actorClass: SubclassOf<T>): T {
    const actor = new actorClass();
    this._actors.push(actor);
    actor.SetWorld(this);

    return actor;
  }

  public GetRenderScene(): THREE.Scene {
    return this._scene;
  }

  protected h: number = 0;

  public Tick(_deltaTime: number): void {
    this._testCube.rotation.x += 0.00562;
    this._testCube.rotation.y += 0.00353;
    this._testCube.rotation.z += 0.00621;

    this.h += 0.00025;
    this.h %= 1;

    const mat = this._testCube.material as THREE.MeshStandardMaterial;
    mat.color.setHSL(this.h, 1, 0.5);

    this._actors.forEach((actor) => {
      actor.Tick(_deltaTime);
    });
  }
}
