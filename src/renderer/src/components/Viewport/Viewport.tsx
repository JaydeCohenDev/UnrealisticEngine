import * as Engine from '@renderer/engine/Engine';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

import '../../assets/viewport.css';

import ViewportSettings from './ViewportSettings';

export default function Viewport() {
  useEffect(() => {
    const renderContext = Engine.CreateRenderContext();

    return () => {
      renderContext.Destroy();
    };
  }, []);

  let isAiming: boolean = false;

  function OnMouseDown(e: React.MouseEvent) {
    const canvas = document.querySelector('#viewport') as HTMLCanvasElement;

    if (e.button === 2) {
      // right click
      e.preventDefault();
      canvas.requestPointerLock();
      isAiming = true;
      return;
    }

    // Editor actor selection
    if (e.button === 0 && window.Editor.AllowActorSelection) {
      const castPos = window.Editor.GetMousePositionInViewport();
      const world = window.Editor.GetWorld();
      const hit = world.LineTraceSingle(castPos);
      console.log(hit);

      window.Editor.SetSelectedActors(hit.actor !== undefined ? [hit.actor] : []);
    }
  }

  function OnMouseUp(e: React.MouseEvent) {
    if (e.button === 2) {
      e.preventDefault();
      document.exitPointerLock();
      isAiming = false;
    }
  }

  function UpdatePosition(e: MouseEvent): void {
    if (isAiming) {
      const xDelta = e.movementX / 1000;
      const yDelta = e.movementY / 1000;

      window.Camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -xDelta);
      const rightVector = new THREE.Vector3(1, 0, 0).applyQuaternion(window.Camera.quaternion);
      window.Camera.rotateOnWorldAxis(rightVector, -yDelta);
    }
  }
  useEffect(() => {
    document.addEventListener('mousemove', UpdatePosition, false);
  }, []);

  return (
    <div className="viewport">
      <canvas id="viewport" onMouseDown={OnMouseDown} onMouseUp={OnMouseUp}></canvas>
      <div className="viewportOverlay">
        <ViewportSettings />
      </div>
    </div>
  );
}
