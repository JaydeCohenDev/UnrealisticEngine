import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IViewportSettingToggle {
  icon: IconProp;
}

export default function ViewportSettingToggle(props: IViewportSettingToggle) {
  return (
    <div className="viewportSettingToggle">
      <FontAwesomeIcon icon={props.icon} />
    </div>
  );
}
