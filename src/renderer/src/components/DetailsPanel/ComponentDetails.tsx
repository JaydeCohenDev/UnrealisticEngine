import ActorComponent from '@renderer/engine/ActorComponent';
import Reflection from '@renderer/engine/Reflection';
import DetailsCategory from './DetailsCategory';

export interface IComponentDetailsProps {
  component: ActorComponent;
}

export default function ComponentDetails(props: IComponentDetailsProps) {
  return (
    <div className="componentDetails">
      <h5 className="detailsComponentName">{props.component.GetDisplayName()}</h5>
      {Reflection.GetPropertyCategoriesOf(props.component).map((category) => {
        return <DetailsCategory key={category} category={category} component={props.component} />;
      })}
    </div>
  );
}
