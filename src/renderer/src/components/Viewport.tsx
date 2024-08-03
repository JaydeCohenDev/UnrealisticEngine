import ActorComponent from '@renderer/engine/ActorComponent';
import * as Engine from '@renderer/engine/Engine';
import FMath from '@renderer/engine/FMath';
import Input from '@renderer/engine/Input';
import { useEffect } from 'react';
import * as THREE from 'three';

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

    if (e.button === 0) {
      // left click

      const cursorPos = Input.GetMousePosition();

      const viewportWidth = canvas.parentElement!.clientWidth;
      const viewportHeight = canvas.parentElement!.clientHeight;
      const viewportStartX = canvas.parentElement!.getBoundingClientRect().x;
      const viewportStartY = canvas.parentElement!.getBoundingClientRect().y;

      const viewportDeltaX = FMath.MapRange(
        cursorPos.x,
        viewportStartX,
        viewportStartX + viewportWidth,
        0,
        viewportWidth
      );

      // const viewportDeltaX = FMath.Clamp(cursorPos.x, viewportStartX, viewportWidth);
      // const viewportDeltaY = FMath.Clamp(cursorPos.y, viewportStartY, viewportHeight);

      //      console.log(cursorPos.y);
      const viewportDeltaY = FMath.MapRange(
        cursorPos.y,
        viewportStartY,
        viewportStartY + viewportHeight,
        0,
        viewportHeight
      );

      const castPos = new THREE.Vector2(
        (viewportDeltaX / viewportWidth) * 2 - 1,
        -(viewportDeltaY / viewportHeight) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(castPos, window.Camera);

      const world = window.Editor.GetWorld();
      const children = world.GetRenderScene().children;
      const intersects = raycaster.intersectObjects(children);

      for (let intersect of intersects) {
        const hitOwner = intersect.object['owner'] as ActorComponent;
        if (hitOwner !== undefined) {
          const hitActor = hitOwner.GetOwner();
          if (hitActor !== undefined && hitActor !== null) {
            window.Editor.SetSelectedActors([hitActor]);
            return;
          }
        }
      }

      window.Editor.SetSelectedActors([]);
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
    </div>
  );
}
