import Actor from '@renderer/engine/Actor';
import { useEffect, useState } from 'react';
import ComponentDetails from './ComponentDetails';

import '../../assets/detailsPanel.css';

export default function DetailsPanel() {
  const [displayActor, setDisplayActor] = useState<Actor | null>(null);

  const DisplayDetails = () => {
    const selectedActors = window.Editor.GetSelectedActors();

    if (selectedActors.length > 0) {
      setDisplayActor(selectedActors[0]);
    } else {
      setDisplayActor(null);
    }
  };

  useEffect(() => {
    window.Editor.OnActorSelectionSetChanged.AddListener(DisplayDetails);
    DisplayDetails();

    return () => {
      window.Editor.OnActorSelectionSetChanged.RemoveListener(DisplayDetails);
    };
  }, []);

  return (
    <div className="panel detailsPanel">
      <h3>Details Panel</h3>
      <h4>{displayActor?.GetDisplayName()}</h4>
      {displayActor
        ?.GetAllComponents()
        .map((component) => <ComponentDetails key={component.Id} component={component} />)}
    </div>
  );
}
