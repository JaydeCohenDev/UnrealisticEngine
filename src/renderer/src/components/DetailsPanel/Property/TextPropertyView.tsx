import { useEffect, useState } from 'react';
import { IPropertyViewProps } from './PropertyViewBase';

export default function TextPropertyView(props: IPropertyViewProps) {
  const [text, setText] = useState(props.uproperty.GetCurrentValueOf(props.component));

  useEffect(() => {
    setText(props.uproperty.GetCurrentValueOf(props.component));

    console.log(props.component);
  }, []);

  const onTextChange = (e) => {
    setText(e.target.value);
    console.log(e.target.value);

    props.uproperty.SetCurrentValueOf(props.component, e.target.value);
  };

  return (
    <>
      <input value={text} onChange={onTextChange} />
    </>
  );
}
