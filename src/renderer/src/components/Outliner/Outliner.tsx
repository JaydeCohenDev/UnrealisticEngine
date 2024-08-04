import Actor from '@renderer/engine/Actor';
import '../../assets/outliner.css';
import OutlinerRow from './OutlinerRow';
import { useEffect, useState } from 'react';
import Message from '@renderer/engine/Message';
import { ArrayContains } from '@renderer/engine/Array';

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

  const RebuildOutlinerList = () => {
    const selectedActors: Actor[] = window.Editor.GetSelectedActors();
    const newActorArray: ActorSelectionState[] = [];

    window.Editor.GetWorld()
      .GetAllActors()
      .forEach((actor) => {
        if (actor.ShowInOutliner()) {
          const isSelected = ArrayContains(selectedActors, actor);
          newActorArray.push(new ActorSelectionState(actor, isSelected));
        }
      });

    setSelectedActors(newActorArray);
  };

  const ActorSelectionSetChanged = () => {
    RebuildOutlinerList();
  };

  useEffect(() => {
    window.Editor.OnActorSelectionSetChanged.AddListener(ActorSelectionSetChanged);
    Message.AddListener('ACTOR_SPAWN', () => {
      RebuildOutlinerList();
    });
    RebuildOutlinerList();

    return () => {
      window.Editor.OnActorSelectionSetChanged.RemoveListener(ActorSelectionSetChanged);
    };
  }, []);

  const handleActorClicked = (actor: Actor) => {
    window.Editor.SetSelectedActors([actor]);
  };

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
