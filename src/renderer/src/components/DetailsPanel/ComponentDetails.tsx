import ActorComponent from '@renderer/engine/ActorComponent';
import Reflection from '@renderer/engine/Reflection';
import ComponentProperty from './ComponentProperty';

export interface IComponentDetailsProps {
  component: ActorComponent;
}

export default function ComponentDetails(props: IComponentDetailsProps) {
  return (
    <div className="componentDetails">
      <h5>{props.component.GetDisplayName()}</h5>

      {Reflection.GetPropertiesOf(props.component).map((uprop) => (
        <ComponentProperty
          key={uprop.GetPropertyName()}
          uprop={uprop}
          component={props.component}
        />
      ))}
    </div>
  );
}
