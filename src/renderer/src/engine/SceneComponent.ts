import ActorComponent from './ActorComponent';

import * as THREE from 'three';

export default class SceneComponent extends ActorComponent {
  public GetRenderObject(): THREE.Object3D {
    throw new Error('Method not implemented.');
  }

  public AllowHitTesting(): boolean {
    return true;
  }
}
