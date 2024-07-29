import Asset from './Asset';

import * as THREE from 'three';

export class StaticMesh extends Asset {
  protected _mesh: THREE.Mesh;
  protected _geometry: THREE.BufferGeometry;
  protected _material: THREE.Material;

  constructor() {
    super();
    this._geometry = new THREE.BoxGeometry(1, 1, 1);
    this._material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    this._mesh = new THREE.Mesh(this._geometry, this._material);
  }

  public GetRenderMesh(): THREE.Mesh {
    return this._mesh;
  }
}
