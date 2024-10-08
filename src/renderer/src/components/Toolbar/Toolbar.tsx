import { EdMenu, EdMenuItem } from '@renderer/engine/EdLayout/EdMenu';

import './../../assets/toolbar.css';
import ToolbarMenuItem from './ToolbarMenuItem';
import Actor from '@renderer/engine/Actor';
import { useEffect, useState } from 'react';
import Debug from '@renderer/engine/Logging/Debug';

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
        window.Editor.SaveLayout();
      })
    );

    windowMenu.AddItem(
      new EdMenuItem('Reset Layout', () => {
        window.Editor.ResetLayout();
      })
    );
    windowMenu.AddItem(
      new EdMenuItem('Refresh', () => {
        window.api.refresh();
      })
    );

    const toolsMenu = menu.AddItem(new EdMenuItem('Tools'));
    toolsMenu.AddItem(
      new EdMenuItem('Dump render scene', () => {
        console.log(window.Editor.GetWorld().GetRenderScene());
      })
    );

    menu.AddItem(new EdMenuItem('Build'));
    menu.AddItem(new EdMenuItem('Select'));

    const actorMenu = menu.AddItem(
      new EdMenuItem('Actor', () => {
        actorMenu.ClearItems();

        const classes = window.Editor.GetSpawnableActorClasses();
        console.log(classes);
        classes.forEach((spawnableActorClass) => {
          actorMenu.AddItem(
            new EdMenuItem(spawnableActorClass.DisplayName, () => {
              const actor = spawnableActorClass.NewInstance<Actor>();
              window.Editor.GetWorld().SpawnExisting(actor);
            })
          );
        });
      })
    );

    menu.AddItem(new EdMenuItem('Help'));

    Debug.Log('toolbar', 'Info', 'toolbar created');

    return menu;
  }

  const [menu, setMenu] = useState<EdMenu>();

  useEffect(() => {
    const m = CreateMenu();
    setMenu(m);

    window.Editor.OnSpawnableActorsUpdated.AddListener((_e) => {
      const m = CreateMenu();
      setMenu(m);
    });
  }, []);

  return (
    <div className="toolbar">
      {menu?.GetItems().map((item, index) => {
        return <ToolbarMenuItem item={item} key={index} />;
      })}
    </div>
  );
}
