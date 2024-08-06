import Actor from './Actor';
import { StaticMesh } from './StaticMesh';
import StaticMeshComponent from './StaticMeshComponent';

import * as THREE from 'three';

export default class TestCylinder extends Actor {
  protected _staticMeshComponent: StaticMeshComponent;

  constructor() {
    super();
    this._staticMeshComponent = this.AddComponent(StaticMeshComponent);

    const staticMesh = StaticMesh.FromCylinder(
      0.5,
      2,
      new THREE.MeshPhysicalMaterial({
        roughness: 0,
        metalness: 0.25,
        color: 0xffffff
      })
    );

    this._staticMeshComponent.SetStaticMesh(staticMesh);
  }
}
