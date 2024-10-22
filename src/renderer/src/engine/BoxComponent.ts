import { UProperty } from './Decorators';
import SceneComponent from './SceneComponent';

import { Mesh, BoxGeometry, MeshBasicMaterial, Object3D, DoubleSide, FrontSide } from 'three';

export default class BoxComponent extends SceneComponent {
  protected _boxMesh: Mesh;

  @UProperty()
  protected TwoSided: boolean = true;

  constructor() {
    super();

    const geo = new BoxGeometry(1, 1, 1);
    const mat = new MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.25,
      side: DoubleSide
    });
    this._boxMesh = new Mesh(geo, mat);
  }

  public GetRenderObject(): Object3D {
    return this._boxMesh;
  }

  public DeselectedInEdtior(): void {
    console.log('boxcomponent deselect');
  }

  public Tick(_deltaTime: number): void {
    (this._boxMesh.material as MeshBasicMaterial).side = this.TwoSided ? DoubleSide : FrontSide;
  }
}
