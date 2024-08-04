import Actor from './Actor';
import { TransformControls } from 'three/examples/jsm/addons';
import StaticMeshComponent from './StaticMeshComponent';
import Input from './Input';

export default class EditorTransformGizmo extends Actor {
  protected _transformGizmo: TransformControls;

  constructor() {
    super();

    this._transformGizmo = new TransformControls(
      window.Camera,
      window.RenderContext?.GetRenderer().domElement
    );

    this._transformGizmo['owner'] = this;
    this._transformGizmo.traverse((child) => {
      child['owner'] = this;
    });

    this._transformGizmo.addEventListener('', (e) => {
      console.log(e);
    });

    this._transformGizmo['noEdHighlight'] = true;
  }

  public BeginPlay(): void {
    this.GetWorld()!.GetRenderScene().add(this._transformGizmo);

    Input.OnKeyPressed.AddListener((keyCode) => {
      if (this._transformGizmo) {
        if (keyCode === 'KeyQ') {
          this._transformGizmo.setSpace(this._transformGizmo.space === 'local' ? 'world' : 'local');
        }
        if (keyCode === 'KeyW') {
          this._transformGizmo.setMode('translate');
        }
        if (keyCode === 'KeyE') {
          this._transformGizmo.setMode('rotate');
        }
        if (keyCode === 'KeyR') {
          this._transformGizmo.setMode('scale');
        }
      }
    });
  }

  public EndPlay(): void {
    this.GetWorld()!.GetRenderScene().remove(this._transformGizmo);
    this._transformGizmo.detach();
    this._transformGizmo.reset();
    this._transformGizmo.dispose();
  }

  public AttachTo(actor: Actor) {
    const smc = actor.GetComponentOfType(StaticMeshComponent);
    if (smc) {
      this._transformGizmo.attach(smc.GetStaticMesh()!.GetRenderMesh());
    }
  }
}
