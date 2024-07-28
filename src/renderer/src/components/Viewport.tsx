import * as Engine from '@renderer/engine/Engine';
import { MouseEventHandler, useEffect } from 'react';

export default function Viewport() {
  useEffect(() => {
    Engine.CreateRenderContext();
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
      console.log(e);

      const xDelta = e.movementX / 1000;
      const yDelta = e.movementY / 1000;

      window.Camera.rotateX(-yDelta);
      window.Camera.rotateY(-xDelta);
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
