import * as Engine from '@renderer/engine/Engine';
import { useEffect } from 'react';
import { Vector3 } from 'three';

export default function Viewport() {
  useEffect(() => {
    const renderContext = Engine.CreateRenderContext();

    return () => {
      renderContext.Destroy();
    };
  }, []);

  let isAiming: boolean = false;

  function OnMouseDown(e: React.MouseEvent) {
    if (e.button === 2) {
      e.preventDefault();
      const canvas = document.querySelector('#viewport') as HTMLCanvasElement;
      canvas.requestPointerLock();
      isAiming = true;
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

      window.Camera.rotateOnWorldAxis(new Vector3(0, 1, 0), -xDelta);
      const rightVector = new Vector3(1, 0, 0).applyQuaternion(window.Camera.quaternion);
      window.Camera.rotateOnWorldAxis(rightVector, -yDelta);
    }
  }

  useEffect(() => {
    document.addEventListener('mousemove', UpdatePosition, false);
  }, []);

  return (
    <div className="viewport">
      <canvas id="viewport" onMouseDown={OnMouseDown} onMouseUp={OnMouseUp}></canvas>
    </div>
  );
}
