import { EdMenu, EdMenuItem } from '@renderer/engine/EdLayout/EdMenu';

import './../../assets/toolbar.css';
import ToolbarMenuItem from './ToolbarMenuItem';

export default function Toolbar() {
  function CreateMenu(): EdMenu {
    const menu = new EdMenu();

    const fileMenu = menu.AddItem(new EdMenuItem('File'));
    fileMenu.AddItem(new EdMenuItem('Open Project'));
    fileMenu.AddItem(new EdMenuItem('Save Project'));
    fileMenu.AddItem(new EdMenuItem('Save All'));
    fileMenu.AddItem(
      new EdMenuItem('Exit', () => {
        alert('exit command receieved!');
      })
    );

    menu.AddItem(new EdMenuItem('Edit'));

    const windowMenu = menu.AddItem(new EdMenuItem('Window'));
    windowMenu.AddItem(
      new EdMenuItem('Save Layout', () => {
        alert('save layout');
      })
    );
    windowMenu.AddItem(new EdMenuItem('Reset Layout'));

    menu.AddItem(new EdMenuItem('Tools'));
    menu.AddItem(new EdMenuItem('Build'));
    menu.AddItem(new EdMenuItem('Select'));
    menu.AddItem(new EdMenuItem('Actor'));
    menu.AddItem(new EdMenuItem('Help'));

    console.log('menu created');

    return menu;
  }

  const menu = CreateMenu();

  return (
    <div className="toolbar">
      {menu.GetItems().map((item) => {
        return <ToolbarMenuItem item={item} />;
      })}
    </div>
  );
}
