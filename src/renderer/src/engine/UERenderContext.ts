import * as THREE from 'three';
import Time from './Time';
import { EffectComposer, RGBELoader } from 'three/examples/jsm/addons';
import {
  RenderPass,
  OutputPass,
  TAARenderPass,
  UnrealBloomPass,
  OutlinePass
} from 'three/examples/jsm/addons';

//import * as POSTPROCESSING from 'postprocessing';

type PostProcessStack = {
  taaPass?: TAARenderPass;
  bloomPass?: UnrealBloomPass;
  outlinePass?: OutlinePass;
};

export default class UERenderContext {
  protected _renderer: THREE.WebGLRenderer;
  protected _camera: THREE.PerspectiveCamera;

  protected _composer: EffectComposer;

  protected _pendingKill: boolean = false;

  public PostProcessStack: PostProcessStack = {};

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

    const hdriLoader = new RGBELoader();
    hdriLoader.load('src/assets/hdr/quarry_01_1k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      window.Editor.GetWorld().GetRenderScene().environment = texture;
      window.Editor.GetWorld().GetRenderScene().background = texture;

      texture.dispose();
    });

    this._composer = new EffectComposer(this._renderer);

    const scene = window.Editor.GetWorld().GetRenderScene();
    const cam = window.Camera;

    const renderPass = new RenderPass(scene, cam);
    this._composer.addPass(renderPass);
    this._composer.setSize(viewportWidth, viewportHeight);

    this.PostProcessStack.taaPass = new TAARenderPass(scene, cam);
    this.PostProcessStack.taaPass.sampleLevel = 8;
    this._composer.addPass(this.PostProcessStack.taaPass);

    this.PostProcessStack.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(viewportWidth, viewportHeight),
      0.15,
      0,
      0
    );
    this._composer.addPass(this.PostProcessStack.bloomPass);

    this.PostProcessStack.outlinePass = new OutlinePass(
      new THREE.Vector2(viewportWidth, viewportHeight),
      scene,
      cam,
      []
    );
    this.PostProcessStack.outlinePass.edgeThickness = 3;
    this.PostProcessStack.outlinePass.edgeStrength = 10;
    this.PostProcessStack.outlinePass.edgeGlow = 0;
    this.PostProcessStack.outlinePass.hiddenEdgeColor = new THREE.Color(0x00000000);
    this._composer.addPass(this.PostProcessStack.outlinePass);

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

  public GetCanvas(): HTMLCanvasElement {
    return this._renderer.domElement;
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
