import Toolbar from './components/Toolbar/Toolbar';

import './assets/edLayout.css';
import Editor from './engine/Editor';
import { useEffect, useReducer } from 'react';

import * as THREE from 'three';
import Input from './engine/Input';
import UERenderContext from './engine/UERenderContext';

import 'dockview/dist/styles/dockview.css';
import {
  DockviewReact,
  DockviewReadyEvent,
  IDockviewPanelHeaderProps,
  IDockviewPanelProps
} from 'dockview';
import Viewport from './components/Viewport/Viewport';
import ContentBrowser from './components/ContentBrowser';
import DetailsPanel from './components/DetailsPanel/DetailsPanel';
import Outliner from './components/Outliner/Outliner';

declare global {
  interface Window {
    Editor: Editor;
    ForceUpdate: React.DispatchWithoutAction;
    Camera: THREE.PerspectiveCamera;
    RenderContext: UERenderContext | undefined;
  }
}

function App(): JSX.Element {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  window.ForceUpdate = forceUpdate;

  useEffect(() => {
    Input.StartListening();

    return () => {
      Input.StopListening();
    };
  });

  const onReady = (event: DockviewReadyEvent) => {
    const viewport = event.api.addPanel({
      id: 'Viewport',
      component: 'viewport',
      params: {
        title: 'Viewport'
      }
    });

    const detailsPanel = event.api.addPanel({
      id: 'Details Panel',
      component: 'detailsPanel',
      params: {
        title: 'Details Panel'
      },
      position: {
        direction: 'right'
      }
    });

    const outliner = event.api.addPanel({
      id: 'Outliner',
      component: 'outliner',
      params: {
        title: 'Outliner'
      },
      position: {
        direction: 'above',
        referencePanel: detailsPanel
      }
    });

    const ContentBrowser = event.api.addPanel({
      id: 'Content Browser',
      component: 'contentBrowser',
      params: {
        title: 'Content Browser'
      },
      position: {
        direction: 'below',
        referencePanel: viewport
      }
    });
  };

  const components = {
    test: (props: IDockviewPanelProps<{ title: string; x?: number }>) => {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            height: '100%'
          }}
        >
          <span>{`${props.params.title}`}</span>
          {props.params.x && <span>{`  ${props.params.x}`}</span>}
        </div>
      );
    },
    viewport: Viewport,
    detailsPanel: DetailsPanel,
    outliner: Outliner,
    contentBrowser: ContentBrowser
  };

  const tabComponents = {
    custom: (props: IDockviewPanelHeaderProps<{ title: string }>) => {
      return (
        <div className="my-custom-tab">
          <span>{props.params.title}</span>
          <span style={{ flexGrow: 1 }} />
        </div>
      );
    }
  };

  return (
    <div className="edWindow">
      <Toolbar />
      <div className="edWindowContent">
        <DockviewReact components={components} onReady={onReady} className="dockview-theme-dark" />
      </div>
    </div>
  );
}

export default App;
