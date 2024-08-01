import ActorComponent from '@renderer/engine/ActorComponent';
import Reflection from '@renderer/engine/Reflection';
import ComponentProperty from './ComponentProperty';

export interface IComponentDetailsProps {
  component: ActorComponent;
}

export default function ComponentDetails(props: IComponentDetailsProps) {
  return (
    <div>
      <h5>{props.component.GetDisplayName()}</h5>

      <ul>
        {Reflection.GetPropertiesOf(props.component).map((propName, index) => (
          <ComponentProperty key={index} component={props.component} propName={propName} />
        ))}
      </ul>
    </div>
  );
}
