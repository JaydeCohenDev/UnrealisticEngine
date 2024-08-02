import { useEffect, useState } from 'react';
import { IPropertyViewProps } from './PropertyViewBase';
import { SketchPicker } from 'react-color';
import * as THREE from 'three';

import '../../../assets/colorPicker.css';

type uiColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export default function ColorPropertyView(props: IPropertyViewProps) {
  const getColorFromSource = (): uiColor => {
    const col: THREE.Color = props.uproperty.GetCurrentValueOf(props.component);
    return {
      r: col.r * 255,
      g: col.g * 255,
      b: col.b * 255,
      a: 1
    };
  };

  const setColorAtSource = (newColor: uiColor) => {
    const col: THREE.Color = new THREE.Color(newColor.r / 255, newColor.g / 255, newColor.b / 255);
    props.uproperty.SetCurrentValueOf(props.component, col);
  };

  const [color, setColor] = useState<uiColor>(getColorFromSource());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setColor(getColorFromSource());
  }, []);

  useEffect(() => {
    setColorAtSource(color);
  }, [color]);

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
