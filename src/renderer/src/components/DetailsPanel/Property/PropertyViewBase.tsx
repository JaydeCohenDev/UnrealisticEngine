import ActorComponent from '@renderer/engine/ActorComponent';
import UProperty from '@renderer/engine/UProperty';

export interface IPropertyViewProps {
  uproperty: UProperty;
  component: ActorComponent;
}

export default function PropertyViewBase() {
  return <></>;
}
