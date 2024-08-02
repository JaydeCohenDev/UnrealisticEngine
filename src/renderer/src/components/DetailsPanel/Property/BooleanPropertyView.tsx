import { useEffect, useState } from 'react';
import { IPropertyViewProps } from './PropertyViewBase';

export default function BooleanPropertyView(props: IPropertyViewProps) {
  const [isChecked, setIsChecked] = useState(props.uproperty.GetCurrentValueOf(props.component));

  useEffect(() => {
    setIsChecked(props.uproperty.GetCurrentValueOf(props.component));
  }, []);

  const onChange = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    props.uproperty.SetCurrentValueOf(props.component, checked);
  };

  return (
    <>
      <input type="checkbox" checked={isChecked} onChange={onChange} />
    </>
  );
}
