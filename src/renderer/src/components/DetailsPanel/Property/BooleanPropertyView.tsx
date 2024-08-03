import { IPropertyViewProps } from './PropertyViewBase';
import CheckBox from '@renderer/components/CheckBox';

export default function BooleanPropertyView(props: IPropertyViewProps) {
  const handleCheckboxToggle = (isChecked: boolean) => {
    props.uproperty.SetCurrentValueOf(props.component, !isChecked);
  };

  return (
    <div>
      <CheckBox
        onChecked={handleCheckboxToggle}
        defaultVal={props.uproperty.GetCurrentValueOf(props.component)}
      />
    </div>
  );
}
