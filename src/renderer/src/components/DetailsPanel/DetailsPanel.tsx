import Actor from '@renderer/engine/Actor';
import { useEffect, useState } from 'react';
import ComponentDetails from './ComponentDetails';

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
    <div className="panel">
      <h2>{displayActor?.GetDisplayName()}</h2>

      {displayActor
        ?.GetAllComponents()
        .map((component) => <ComponentDetails component={component} />)}
    </div>
  );
}
