import ActorComponent from '@renderer/engine/ActorComponent';
import UProperty from '@renderer/engine/UProperty';

export interface IComponentPropertyProps {
  uprop: UProperty;
  component: ActorComponent;
}

export default function ComponentProperty(props: IComponentPropertyProps) {
  const PropViewComponent = window.Editor.GetPropertyViewFor(props.uprop.GetTypeName())!;

  return (
    <div className="propertyDetails">
      <div>{props.uprop.GetPropertyName()}</div>
      <PropViewComponent uproperty={props.uprop} component={props.component} />
    </div>
  );
}
