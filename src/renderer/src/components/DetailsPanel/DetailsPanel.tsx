import Actor from '@renderer/engine/Actor';
import { useEffect, useState } from 'react';
import ComponentDetails from './ComponentDetails';

import { faSearch } from '@fortawesome/free-solid-svg-icons';

import '../../assets/detailsPanel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    <div className="detailsWrapper">
      <div className="detailsPanel">
        <div className="detailsHeader">
          <h4>{displayActor?.GetDisplayName()}</h4>
          <div className="searchBox">
            <FontAwesomeIcon icon={faSearch} />
            <input placeholder="Search" />
          </div>
        </div>
        {displayActor
          ?.GetAllComponents()
          .map((component) => <ComponentDetails key={component.Id} component={component} />)}
      </div>
    </div>
  );
}
