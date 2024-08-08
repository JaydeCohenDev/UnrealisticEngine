import ActorComponent from './ActorComponent';

import * as THREE from 'three';
import { TransformAttachmentRules } from './AttachmentMethod';

export default class SceneComponent extends ActorComponent {
  public GetRenderObject(): THREE.Object3D {
    throw new Error('Method not implemented.');
  }

  public AllowHitTesting(): boolean {
    return true;
  }

  public GetWorldLocation(): THREE.Vector3 {
    return this.GetRenderObject().position.clone();
  }

  public AttachTo(
    parent: SceneComponent,
    attachRules: TransformAttachmentRules = {
      position: 'SnapToTarget',
      rotation: 'SnapToTarget',
      scale: 'SnapToTarget'
    }
  ) {
    parent.GetRenderObject().add(this.GetRenderObject());
    console.log(this.GetRenderObject().parent);
  }
}
