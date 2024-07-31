import ActorComponent from '@renderer/engine/ActorComponent';

export interface IComponentPropertyProps {
  component: ActorComponent;
  propName: string;
}

export default function ComponentProperty(props: IComponentPropertyProps) {
  const getPropertyValue = () => {
    return props.component[props.propName];
  };

  return (
    <li>
      {props.propName} = {getPropertyValue()}
    </li>
  );
}
