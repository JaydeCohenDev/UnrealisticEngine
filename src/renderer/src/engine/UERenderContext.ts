import * as THREE from 'three';
import Time from './Time';

export default class UERenderContext {
  protected _renderer: THREE.WebGLRenderer;
  protected _scene: THREE.Scene;
  protected _camera: THREE.PerspectiveCamera;

  protected _testCube: THREE.Mesh;

  protected _floorMesh: THREE.Mesh;

  public constructor(canvas: HTMLCanvasElement) {
    const viewportWidth = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
    const viewportHeight = canvas.parentElement ? canvas.parentElement.clientHeight : 0;
    const aspectRatio: number = viewportWidth / viewportHeight;
    const nearClip = 0.1;
    const farClip = 1000;

    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(75, aspectRatio, nearClip, farClip);
    window.Camera = this._camera;

    this._renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    this._renderer.setSize(viewportWidth, viewportHeight);
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this._scene.background = new THREE.Color('#e8f7fc');

    new ResizeObserver(() => {
      this.ResizeToParent();
    }).observe(canvas.parentElement!);

    window.addEventListener('resize', (_) => {
      this.ResizeToParent();
    });

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

    this._camera.position.z = 5;
    this._camera.position.y = 2.5;

    const helper = new THREE.CameraHelper(sun.shadow.camera);
    this._scene.add(helper);
    this.Render();
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
    sun.shadow.camera.far = 100;
    return sun;
  }

  protected CreateSkylight(): THREE.AmbientLight {
    return new THREE.AmbientLight(0xffffff, 0.5);
  }

  protected ResizeToParent(): void {
    const canvas = this._renderer.domElement;
    const viewportWidth = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
    const viewportHeight = canvas.parentElement ? canvas.parentElement.clientHeight : 0;
    const aspectRatio: number = viewportWidth / viewportHeight;

    this._renderer.setSize(viewportWidth, viewportHeight);

    this._camera.aspect = aspectRatio;
    this._camera.updateProjectionMatrix();
  }

  protected h: number = 0;

  protected Render(timestamp: number = 0): void {
    Time.TickTimer.update(timestamp);

    this._renderer.render(this._scene, this._camera);

    this._testCube.rotation.x += 0.00562;
    this._testCube.rotation.y += 0.00353;
    this._testCube.rotation.z += 0.00621;

    this.h += 0.00025;
    this.h %= 1;

    const mat = this._testCube.material as THREE.MeshStandardMaterial;
    mat.color.setHSL(this.h, 1, 0.5);

    window.requestAnimationFrame((timestamp) => {
      this.Render(timestamp);
    });

    window.Editor.GetWorld().Tick(Time.GetWorldDeltaSeconds());
  }
}
