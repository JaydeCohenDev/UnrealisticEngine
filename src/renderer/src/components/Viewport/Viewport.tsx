import * as Engine from '@renderer/engine/Engine';
import { useEffect } from 'react';
import * as THREE from 'three';

import '../../assets/viewport.css';
import ViewportControlGroup from './ViewportControlGroup';
import ViewportSettingToggle from './ViewportSettingToggle';
import {
  faArrowsSpin,
  faCamera,
  faCompassDrafting,
  faExpand,
  faEye,
  faGlobe,
  faSortDown,
  faTableCells,
  faUpDownLeftRight,
  faUpRightAndDownLeftFromCenter
} from '@fortawesome/free-solid-svg-icons';
import ViewportSettingDropdown from './ViewportSettingDropdown';

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
    if (e.button === 0) {
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
        <div className="viewportControls">
          <ViewportControlGroup>
            <ViewportSettingDropdown icon={faSortDown} />
          </ViewportControlGroup>

          <ViewportControlGroup>
            <ViewportSettingDropdown icon={faEye} name="View Mode" />
          </ViewportControlGroup>

          <ViewportControlGroup>
            <ViewportSettingDropdown icon={faCamera} name="Render Mode" />
          </ViewportControlGroup>

          <ViewportControlGroup>
            <ViewportSettingDropdown name="Show" />
          </ViewportControlGroup>

          <div style={{ flexGrow: 1 }}></div>

          <ViewportControlGroup>
            <ViewportSettingToggle icon={faUpDownLeftRight} />
            <ViewportSettingToggle icon={faArrowsSpin} />
            <ViewportSettingToggle icon={faUpRightAndDownLeftFromCenter} />
          </ViewportControlGroup>
          <ViewportControlGroup>
            <ViewportSettingToggle icon={faGlobe} />
          </ViewportControlGroup>
          <ViewportControlGroup>
            <ViewportSettingToggle icon={faTableCells} />
          </ViewportControlGroup>
          <ViewportControlGroup>
            <ViewportSettingToggle icon={faCompassDrafting} />
          </ViewportControlGroup>
          <ViewportControlGroup>
            <ViewportSettingToggle icon={faExpand} />
          </ViewportControlGroup>
        </div>
      </div>
    </div>
  );
}
