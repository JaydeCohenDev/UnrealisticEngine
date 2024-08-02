import { useState } from 'react';
import { IPropertyViewProps } from './PropertyViewBase';
import { SketchPicker } from 'react-color';

import '../../../assets/colorPicker.css';

export default function ColorPropertyView(props: IPropertyViewProps) {
  const [color, setColor] = useState({ r: 241, g: 112, b: 19, a: 1 });
  const [showPicker, setShowPicker] = useState(false);

  const handleClick = () => {
    setShowPicker(true);
  };
  const handleClose = () => {
    setShowPicker(false);
  };
  const handleChange = (c) => {
    setColor(c.rgb);
  };

  return (
    <div>
      <div className="colorSwatch" onClick={handleClick}>
        <div
          className="colorSquare"
          style={{
            background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
          }}
        ></div>
      </div>
      {showPicker && (
        <div className="colorPopover">
          <div className="colorCover" onClick={handleClose} />
          <SketchPicker color={color} onChange={handleChange} />
        </div>
      )}
    </div>
  );
}
