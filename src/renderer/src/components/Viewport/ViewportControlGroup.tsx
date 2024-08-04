interface IViewportControlGroupProps {
  children: JSX.Element[] | JSX.Element;
}

export default function ViewportControlGroup(props: IViewportControlGroupProps) {
  return <div className="viewportControlGroup">{props.children}</div>;
}
