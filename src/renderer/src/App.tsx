import EditorPane from './components/EditorPane';
import Toolbar from './components/Toolbar/Toolbar';

import './assets/edLayout.css';
import Editor from './engine/Editor';
import { useReducer } from 'react';

declare global {
  interface Window {
    Editor: Editor;
    ForceUpdate: React.DispatchWithoutAction;
  }
}

function App(): JSX.Element {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  console.log('app rendering');

  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  window.ForceUpdate = forceUpdate;

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
