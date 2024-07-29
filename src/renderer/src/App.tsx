import EditorPane from './components/EditorPane';
import Toolbar from './components/Toolbar/Toolbar';

import './assets/edLayout.css';
import Editor from './engine/Editor';
import { useEffect, useReducer } from 'react';

import * as THREE from 'three';
import Input from './engine/Input';
import UERenderContext from './engine/UERenderContext';

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

  console.log('app rendering');

  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  window.ForceUpdate = forceUpdate;

  useEffect(() => {
    Input.StartListening();

    return () => {
      Input.StopListening();
    };
  });

  return (
    <div className="edWindow">
      <div className="full-size">
        <Toolbar />
        <EditorPane layout={window.Editor.GetLayout().GetRootPane()} />
      </div>
    </div>
  );
}

export default App;
