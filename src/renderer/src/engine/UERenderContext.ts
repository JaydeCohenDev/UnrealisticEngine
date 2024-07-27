import * as THREE from 'three';

export default class UERenderContext {
  protected _renderer: THREE.WebGLRenderer;
  protected _scene: THREE.Scene;
  protected _camera: THREE.PerspectiveCamera;

  protected _testCube: THREE.Mesh;

  public constructor(canvas: HTMLCanvasElement) {
    const viewportWidth = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
    const viewportHeight = canvas.parentElement ? canvas.parentElement.clientHeight : 0;
    const aspectRatio: number = viewportWidth / viewportHeight;
    const nearClip = 0.1;
    const farClip = 1000;

    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(75, aspectRatio, nearClip, farClip);

    this._renderer = new THREE.WebGLRenderer({ canvas: canvas });
    this._renderer.setSize(viewportWidth, viewportHeight);

    new ResizeObserver(() => {
      this.ResizeToParent();
    }).observe(canvas.parentElement!);

    window.addEventListener('resize', (_) => {
      this.ResizeToParent();
    });

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this._testCube = new THREE.Mesh(geometry, material);
    this._scene.add(this._testCube);

    this._camera.position.z = 2.5;

    this._renderer.setAnimationLoop(() => {
      this.Render();
    });
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

  protected Render(): void {
    this._renderer.render(this._scene, this._camera);

    this._testCube.rotation.x += 0.00562;
    this._testCube.rotation.y += 0.00353;
    this._testCube.rotation.z += 0.00621;

    this.h += 0.00025;
    this.h %= 1;

    const mat = this._testCube.material as THREE.MeshBasicMaterial;
    mat.color.setHSL(this.h, 1, 0.5);
  }
}
