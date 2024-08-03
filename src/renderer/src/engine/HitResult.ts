import Actor from './Actor';
import SceneComponent from './SceneComponent';

import * as THREE from 'three';

export default interface IHitResult {
  actor?: Actor;
  component?: SceneComponent;
  position?: THREE.Vector3;
  distance?: number;
  renderObject?: THREE.Object3D<THREE.Object3DEventMap>;
}
