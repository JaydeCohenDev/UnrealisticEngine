import { useEffect, useState } from 'react';
import { IPropertyViewProps } from './PropertyViewBase';

export default function NumberPropertyView(props: IPropertyViewProps) {
  const [num, setNum] = useState(props.uproperty.GetCurrentValueOf(props.component));

  useEffect(() => {
    setNum(props.uproperty.GetCurrentValueOf(props.component));
  }, []);

  const onTextChange = (e) => {
    setNum(e.target.value);
    props.uproperty.SetCurrentValueOf(props.component, e.target.value);
  };

  return (
    <>
      <input type="number" value={num} onChange={onTextChange} />
    </>
  );
}
