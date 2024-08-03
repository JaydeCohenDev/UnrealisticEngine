import ActorComponent from '@renderer/engine/ActorComponent';
import Reflection from '@renderer/engine/Reflection';
import ComponentProperty from './ComponentProperty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export interface IDetailsCategoryProps {
  category: string;
  component: ActorComponent;
}

export default function DetailsCategory(props: IDetailsCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggleCategory = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="detailsCategory">
      <div className="categoryHeader" onClick={handleToggleCategory}>
        <FontAwesomeIcon
          className="categoryCollapseIcon"
          icon={faChevronDown}
          style={{ rotate: isExpanded ? '0deg' : '-90deg' }}
        />
        {props.category}
      </div>
      <div className={'categoryContents ' + (!isExpanded ? 'categoryCollapse' : 'categoryShow')}>
        {Reflection.GetPropertiesOf(props.component).map((uprop) => {
          if (uprop.GetCategory() === props.category)
            return (
              <ComponentProperty
                key={uprop.GetPropertyName()}
                uprop={uprop}
                component={props.component}
              />
            );
        })}
      </div>
    </div>
  );
}
