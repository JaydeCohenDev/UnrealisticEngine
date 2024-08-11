import EditorPane from './components/EditorPane';
import Toolbar from './components/Toolbar/Toolbar';

import './assets/edLayout.css';
import Editor from './engine/Editor';
import { useEffect, useReducer } from 'react';

import * as THREE from 'three';
import Input from './engine/Input';
import UERenderContext from './engine/UERenderContext';

import 'dockview/dist/styles/dockview.css';
import {
  DockviewApi,
  DockviewDefaultTab,
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
      id: 'viewport',
      component: 'viewport',
      params: {
        title: 'Viewport'
      }
    });

    const detailsPanel = event.api.addPanel({
      id: 'detailsPanel',
      component: 'detailsPanel',
      params: {
        title: 'Details Panel'
      },
      position: {
        direction: 'right'
      }
    });

    const outliner = event.api.addPanel({
      id: 'outliner',
      component: 'outliner',
      params: {
        title: 'Outliner'
      },
      position: {
        direction: 'below'
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
    outliner: Outliner
  };

  const tabComponents = {
    custom: (props: IDockviewPanelHeaderProps<{ title: string }>) => {
      return (
        <div className="my-custom-tab">
          <span>{props.params.title}</span>
          <span style={{ flexGrow: 1 }} />

          {/* <span className="my-custom-tab-icon material-symbols-outlined">minimize</span>
          <span className="my-custom-tab-icon material-symbols-outlined">maximize</span>
          <span className="my-custom-tab-icon material-symbols-outlined">close</span> */}
        </div>
      );
    }
  };

  return (
    <>
      <DockviewReact components={components} onReady={onReady} className="dockview-theme-dark" />
    </>
  );
}

export default App;
