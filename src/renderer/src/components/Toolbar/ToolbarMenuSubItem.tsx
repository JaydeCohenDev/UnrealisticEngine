import { EdMenuItem } from '@renderer/engine/EdLayout/EdMenu';

interface IToolbarMenuSubItemProps {
  item: EdMenuItem;
}

export default function ToolbarMenuSubItem(props: IToolbarMenuSubItemProps) {
  function WhenClicked(): void {
    props.item.OnClick();
  }

  return (
    <div className="toolbarMenuSubItem" onClick={WhenClicked}>
      {props.item.GetDisplayText()}
    </div>
  );
}
