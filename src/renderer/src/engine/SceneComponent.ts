import ActorComponent from './ActorComponent';

import * as THREE from 'three';
import { TransformAttachmentRules } from './AttachmentMethod';
import Rotator from './Rotator';

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

  public SetWorldLocation(newLocation: THREE.Vector3) {
    this.GetRenderObject().position.copy(newLocation);
  }

  public SetWorldRotation(newRotation: Rotator) {
    this.GetRenderObject().rotation.copy(newRotation.Euler);
  }

  public SelectedInEditor(): void {}
  public DeselectedInEdtior(): void {}

  public AttachTo(
    parent: SceneComponent,
    attachRules: TransformAttachmentRules = {
      position: 'SnapToTarget',
      rotation: 'SnapToTarget',
      scale: 'SnapToTarget'
    }
  ) {
    parent.GetRenderObject().add(this.GetRenderObject());
  }

  nri;
}
