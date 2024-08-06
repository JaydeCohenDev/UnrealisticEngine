import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

interface IViewportSettingToggle {
  icon: IconProp;
  enabled?: boolean;
  toggleCallback?: (enabled: boolean) => void;
}

export default function ViewportSettingToggle(props: IViewportSettingToggle) {
  const [enabled, setEnabled] = useState(props.enabled ?? false);

  const getEnabled = (): boolean => {
    if (props.enabled !== undefined) {
      return props.enabled;
    }

    return enabled;
  };

  useEffect(() => {
    if (props.toggleCallback) {
      props.toggleCallback(getEnabled());
    }
  }, [getEnabled()]);

  const handleOnClick = () => {
    if (props.toggleCallback === undefined) setEnabled(!getEnabled());
    else props.toggleCallback(!getEnabled());
  };

  return (
    <div
      onClick={handleOnClick}
      className={'viewportSettingToggle ' + (getEnabled() ? 'toggleEnabled' : '')}
    >
      <FontAwesomeIcon icon={props.icon} />
    </div>
  );
}
