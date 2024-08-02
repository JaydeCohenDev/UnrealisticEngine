import { useEffect, useState } from 'react';
import { IPropertyViewProps } from './PropertyViewBase';

export default function NumberPropertyView(props: IPropertyViewProps) {
  const [num, setNum] = useState(props.uproperty.GetCurrentValueOf(props.component));

  useEffect(() => {
    setNum(props.uproperty.GetCurrentValueOf(props.component));
  }, []);

  const onTextChange = (e) => {
    let newVal = e.target.value as number;

    if (props.uproperty.GetSpecifiers().minVal !== undefined) {
      newVal = Math.max(newVal, props.uproperty.GetSpecifiers().minVal!);
    }

    if (props.uproperty.GetSpecifiers().maxVal !== undefined) {
      newVal = Math.min(newVal, props.uproperty.GetSpecifiers().maxVal!);
    }

    setNum(newVal);
    props.uproperty.SetCurrentValueOf(props.component, newVal);
  };

  return (
    <>
      <input
        className="detailsInput"
        step={props.uproperty.GetSpecifiers()?.numberStepSize ?? 1}
        type="number"
        value={num}
        onChange={onTextChange}
      />
    </>
  );
}
