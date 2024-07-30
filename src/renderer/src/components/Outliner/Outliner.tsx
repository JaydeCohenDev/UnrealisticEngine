import Actor from '@renderer/engine/Actor';
import '../../assets/outliner.css';
import OutlinerRow from './OutlinerRow';
import { useEffect, useRef, useState } from 'react';
import Message from '@renderer/engine/Message';

class ActorSelectionState {
  public Actor: Actor;
  public IsSelected: boolean;

  constructor(actor: Actor, isSelected: boolean) {
    this.Actor = actor;
    this.IsSelected = isSelected;
  }
}

export default function Outliner() {
  const [selectedActors, setSelectedActors] = useState<ActorSelectionState[]>([]);
  const [isDirty, setIsDirty] = useState(true);

  const handleActorClicked = (actor: Actor) => {
    // TODO move selected actor tracking to editor, and have UI read, write. Will help
    // with state loss on repaint.
    const newActors: ActorSelectionState[] = [];

    selectedActors.forEach((actorState) => {
      actorState.IsSelected = actorState.Actor === actor;
      newActors.push(actorState);
    });

    setSelectedActors(newActors);
  };

  const onActorSpawned = (data) => {
    setIsDirty(!isDirty);
  };

  useEffect(() => {
    Message.AddListener('ACTOR_SPAWN', onActorSpawned);

    const newActorArray: ActorSelectionState[] = [];

    window.Editor.GetWorld()
      .GetAllActors()
      .forEach((actor) => {
        newActorArray.push(new ActorSelectionState(actor, false));
      });

    setSelectedActors(newActorArray);
  }, [isDirty]);

  return (
    <div className="outlinerPanel">
      <h3>Outliner</h3>
      <div className="outlinerListScrollbox">
        <ul className="outlinerList">
          {selectedActors.map((actorState, index) => {
            return (
              <OutlinerRow
                isSelected={actorState.IsSelected}
                key={index}
                actor={actorState.Actor}
                clickHandler={handleActorClicked}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
