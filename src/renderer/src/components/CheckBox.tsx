import { useState } from 'react';
import '../assets/checkbox.css';

interface ICheckBoxProps {
  defaultVal?: boolean;
  onChecked?: (isChecked: boolean) => void;
}

export default function CheckBox(props: ICheckBoxProps) {
  const [isChecked, setIsChecked] = useState(props.defaultVal ?? false);

  const handleCheckboxClick = () => {
    setIsChecked(!isChecked);
    if (props.onChecked !== undefined) {
      props.onChecked(isChecked);
    }
  };

  return (
    <div className="checkBoxBg" onClick={handleCheckboxClick}>
      <div className="checkBoxFill" style={{ opacity: isChecked ? 1 : 0 }}></div>
    </div>
  );
}
