import ActorComponent from '@renderer/engine/ActorComponent';
import UProperty from '@renderer/engine/UProperty';

export interface IComponentPropertyProps {
  uprop: UProperty;
  component: ActorComponent;
}

export default function ComponentProperty(props: IComponentPropertyProps) {
  const PropViewComponent = window.Editor.GetPropertyViewFor(props.uprop.GetTypeName())!;

  const toDisplayText = (text: string): string => {
    return text.replace(/([a-z])([A-Z])/g, '$1 $2');
  };

  return (
    <div className="propertyDetails">
      <div className="propName">{toDisplayText(props.uprop.GetPropertyName())}</div>
      <PropViewComponent uproperty={props.uprop} component={props.component} />
    </div>
  );
}
