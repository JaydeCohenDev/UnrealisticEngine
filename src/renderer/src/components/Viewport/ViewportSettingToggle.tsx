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

  useEffect(() => {
    if (props.toggleCallback) {
      props.toggleCallback(enabled);
    }
  }, [enabled]);

  const handleOnClick = () => {
    setEnabled(!enabled);
  };

  return (
    <div
      onClick={handleOnClick}
      className={'viewportSettingToggle ' + (enabled ? 'toggleEnabled' : '')}
    >
      <FontAwesomeIcon icon={props.icon} />
    </div>
  );
}
