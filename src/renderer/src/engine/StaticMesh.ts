import { GLTFLoader } from 'three/examples/jsm/addons';
import Asset from './Asset';

import * as THREE from 'three';

export class StaticMesh extends Asset {
  protected _mesh: THREE.Mesh;
  protected _geometry: THREE.BufferGeometry;
  protected _material: THREE.Material;

  public static FromBox(
    width: number,
    height: number,
    depth: number,
    material: THREE.Material
  ): StaticMesh {
    const mesh = new StaticMesh();
    mesh._geometry = new THREE.BoxGeometry(width, height, depth);
    mesh._mesh = new THREE.Mesh(mesh._geometry, material);

    return mesh;
  }

  public static FromCylinder(radius: number, height: number, material: THREE.Material): StaticMesh {
    const mesh = new StaticMesh();
    mesh._geometry = new THREE.CylinderGeometry(radius, radius, height);
    mesh._mesh = new THREE.Mesh(mesh._geometry, material);
    return mesh;
  }

  public static FromGLTF(path: string, callback: (staticMesh: StaticMesh) => void): void {
    const mesh = new StaticMesh();

    const loader = new GLTFLoader();

    loader.load(path, (data) => {
      const loadedMesh = data.scene.children[0] as THREE.Mesh;
      mesh._geometry = loadedMesh.geometry;
      mesh._material = loadedMesh.material as THREE.Material;
      mesh._mesh = loadedMesh;

      callback(mesh);
    });
  }

  constructor() {
    super();

    this._geometry = new THREE.BoxGeometry(1, 1, 1);
    this._material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    this._mesh = new THREE.Mesh(this._geometry, this._material);
  }

  public GetRenderMesh(): THREE.Mesh {
    return this._mesh;
  }
}
