import EditorPane from './components/EditorPane';
import Toolbar from './components/Toolbar/Toolbar';

import './assets/edLayout.css';
import Editor from './engine/Editor';

declare global {
  interface Window {
    Editor: Editor;
  }
}

function App(): JSX.Element {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

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
