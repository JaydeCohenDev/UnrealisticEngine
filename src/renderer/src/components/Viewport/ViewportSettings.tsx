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
import { useEffect, useState } from 'react';
import EditorTransformGizmoComponent from '@renderer/engine/EditorTransformGizmoComponent';

export default function ViewportSettings() {
  const [transformSpace, setTransformSpace] = useState(
    window.Editor.ViewportSettings.transformSpace === 'local'
  );
  const [enablePositionSnapping, setEnablePositionSnapping] = useState<boolean>(
    window.Editor.ViewportSettings.enablePositionSnapping
  );
  const [enableRotationSnapping, setEnableRotationSnapping] = useState<boolean>(
    window.Editor.ViewportSettings.enableRotationSnapping
  );
  const [enableScaleSnapping, setEnableScaleSnapping] = useState<boolean>(
    window.Editor.ViewportSettings.enableScaleSnapping
  );

  useEffect(() => {
    window.Editor.OnTransformSpaceChanged.AddListener((_e) => {
      setTransformSpace(window.Editor.TransformGizmo!.IsLocalSpace());
    });
  }, []);

  useEffect(() => {
    window.Editor.TransformGizmo?.SetIsLocalSpace(transformSpace);
  }, [transformSpace]);

  useEffect(() => {
    const gizmoComponent = window.Editor.TransformGizmo?.GetComponentOfType(
      EditorTransformGizmoComponent
    );
    if (gizmoComponent !== undefined)
      gizmoComponent.TransformGizmo.translationSnap = enablePositionSnapping ? 1 : 0;

    window.Editor.ViewportSettings.enablePositionSnapping = enablePositionSnapping;
  }, [enablePositionSnapping]);

  useEffect(() => {
    const gizmoComponent = window.Editor.TransformGizmo?.GetComponentOfType(
      EditorTransformGizmoComponent
    );
    if (gizmoComponent !== undefined)
      gizmoComponent.TransformGizmo.rotationSnap = enableRotationSnapping ? Math.PI / 4 : 0;

    window.Editor.ViewportSettings.enableRotationSnapping = enableRotationSnapping;
  }, [enableRotationSnapping]);

  useEffect(() => {
    const gizmoComponent = window.Editor.TransformGizmo?.GetComponentOfType(
      EditorTransformGizmoComponent
    );
    if (gizmoComponent !== undefined)
      gizmoComponent.TransformGizmo.setScaleSnap(enableScaleSnapping ? 0.25 : 0);

    window.Editor.ViewportSettings.enableScaleSnapping = enableScaleSnapping;
  }, [enableScaleSnapping]);

  return (
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
      <div id="fpsCounter" style={{ fontSize: 16 }}>
        FPS: asdf
      </div>
      <div style={{ flexGrow: 1 }}></div>
      <ViewportControlGroup>
        <ViewportSettingToggle icon={faUpDownLeftRight} />
        <ViewportSettingToggle icon={faArrowsSpin} />
        <ViewportSettingToggle icon={faUpRightAndDownLeftFromCenter} />
      </ViewportControlGroup>
      <ViewportControlGroup>
        <ViewportSettingToggle
          icon={faGlobe}
          enabled={transformSpace}
          toggleCallback={(enabled) => {
            setTransformSpace(enabled);
          }}
        />
      </ViewportControlGroup>
      <ViewportControlGroup>
        <ViewportSettingToggle
          icon={faTableCells}
          enabled={enablePositionSnapping}
          toggleCallback={(enabled) => {
            setEnablePositionSnapping(enabled);
          }}
        />
      </ViewportControlGroup>
      <ViewportControlGroup>
        <ViewportSettingToggle
          icon={faCompassDrafting}
          enabled={enableRotationSnapping}
          toggleCallback={(enabled) => {
            setEnableRotationSnapping(enabled);
          }}
        />
      </ViewportControlGroup>
      <ViewportControlGroup>
        <ViewportSettingToggle
          icon={faExpand}
          enabled={enableScaleSnapping}
          toggleCallback={(enabled) => {
            setEnableScaleSnapping(enabled);
          }}
        />
      </ViewportControlGroup>
    </div>
  );
}
