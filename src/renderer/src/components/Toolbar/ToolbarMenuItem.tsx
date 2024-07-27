import { EdMenuItem } from '@renderer/engine/EdLayout/EdMenu';
import ToolbarMenuSubItem from './ToolbarMenuSubItem';
import { useState } from 'react';

interface IToolbarMenuItemProps {
  item: EdMenuItem;
}

export default function ToolbarMenuItem(props: IToolbarMenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  function WhenClicked() {
    setIsOpen(!isOpen);
  }

  function WhenMouseLeave() {
    setIsOpen(false);
  }

  return (
    <div>
      <div className="toolbarMenu" onClick={WhenClicked}>
        {props.item.GetDisplayText()}
      </div>
      <div className="toolbarMenuDropdown" style={{ display: isOpen ? 'block' : 'none' }} onMouseLeave={WhenMouseLeave}>
        {props.item.GetItems().map((item) => {
          return <ToolbarMenuSubItem item={item} />;
        })}
      </div>
    </div>
  );
}
