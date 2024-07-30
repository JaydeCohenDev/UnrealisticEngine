import Actor from '@renderer/engine/Actor';

export interface IOutlinerRowProps {
  actor: Actor;
  clickHandler: (actor: Actor) => void;
  isSelected: boolean;
}

export default function OutlinerRow(props: IOutlinerRowProps) {
  const handleOnClick = () => {
    props.clickHandler(props.actor);
  };

  return (
    <li className={props.isSelected ? 'selected' : 'outlinerRow'} onClick={handleOnClick}>
      {props.actor.GetDisplayName()}
    </li>
  );
}
