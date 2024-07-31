import ActorComponent from '@renderer/engine/ActorComponent';
import Reflection from '@renderer/engine/Reflection';
import ComponentProperty from './ComponentProperty';

export interface IComponentDetailsProps {
  component: ActorComponent;
}

export default function ComponentDetails(props: IComponentDetailsProps) {
  return (
    <div>
      <h3>{props.component.GetDisplayName()}</h3>

      <ul>
        {Reflection.GetPropertiesOf(props.component).map((propName) => (
          <ComponentProperty component={props.component} propName={propName} />
        ))}
      </ul>
    </div>
  );
}
