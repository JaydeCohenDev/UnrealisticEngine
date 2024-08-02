import * as THREE from 'three';
import Time from './Time';
import { EffectComposer } from 'three/examples/jsm/addons';
import {
  RenderPass,
  OutputPass,
  GlitchPass,
  TAARenderPass,
  UnrealBloomPass
} from 'three/examples/jsm/addons';

import * as POSTPROCESSING from 'postprocessing';

export default class UERenderContext {
  protected _renderer: THREE.WebGLRenderer;
  protected _camera: THREE.PerspectiveCamera;

  protected _composer: EffectComposer;

  protected _pendingKill: boolean = false;

  public constructor(canvas: HTMLCanvasElement) {
    console.log('rendering context created');

    const viewportWidth = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
    const viewportHeight = canvas.parentElement ? canvas.parentElement.clientHeight : 0;
    const aspectRatio: number = viewportWidth / viewportHeight;
    const nearClip = 0.1;
    const farClip = 1000;

    this._camera = new THREE.PerspectiveCamera(75, aspectRatio, nearClip, farClip);
    window.Camera = this._camera;

    this._camera.position.z = 5;
    this._camera.position.y = 2.5;

    this._renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    this._renderer.setSize(viewportWidth, viewportHeight);
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this._composer = new EffectComposer(this._renderer);

    const scene = window.Editor.GetWorld().GetRenderScene();
    const cam = window.Camera;

    const renderPass = new RenderPass(scene, cam);
    this._composer.addPass(renderPass);
    this._composer.setSize(viewportWidth, viewportHeight);

    const taaPass = new TAARenderPass(scene, cam);
    taaPass.sampleLevel = 8;
    this._composer.addPass(taaPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(viewportWidth, viewportHeight),
      0.15,
      0,
      0
    );
    this._composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    this._composer.addPass(outputPass);

    new ResizeObserver(() => {
      this.ResizeToParent();
    }).observe(canvas.parentElement!);

    window.addEventListener('resize', (_) => {
      this.ResizeToParent();
    });

    this.Render();

    window.RenderContext = this;
  }

  public GetCamera(): THREE.PerspectiveCamera {
    return this._camera;
  }

  public GetRenderer(): THREE.WebGLRenderer {
    return this._renderer;
  }

  public Destroy(): void {
    console.log('rendering context being destroyed');

    this._pendingKill = true;
    window.RenderContext = undefined;
  }

  protected ResizeToParent(): void {
    const canvas = this._renderer.domElement;
    const viewportWidth = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
    const viewportHeight = canvas.parentElement ? canvas.parentElement.clientHeight : 0;
    const aspectRatio: number = viewportWidth / viewportHeight;

    this._renderer.setSize(viewportWidth, viewportHeight);
    this._composer.setSize(viewportWidth, viewportHeight);

    this._camera.aspect = aspectRatio;
    this._camera.updateProjectionMatrix();
  }

  protected Render(timestamp: number = 0): void {
    if (this._pendingKill) return;

    Time.TickTimer.update(timestamp);

    this._composer.render();
    //this._renderer.render(window.Editor.GetWorld().GetRenderScene(), this._camera);

    window.requestAnimationFrame((timestamp) => {
      this.Render(timestamp);
    });

    window.Editor.GetWorld().Tick(Time.GetWorldDeltaSeconds());
  }
}
