import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IViewportSettingDropdown {
  icon?: IconProp;
  name?: string;
}

export default function ViewportSettingDropdown(props: IViewportSettingDropdown) {
  return (
    <div className="viewportSettingDropdown">
      {props.icon !== undefined && <FontAwesomeIcon icon={props.icon!} />}
      {props.name !== undefined && ' ' + props.name}
    </div>
  );
}
