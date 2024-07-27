import Split from 'react-split';
import { EditorLayout, EditorLayoutPanel } from './engine/EdLayout/EditorLayout';
import Viewport from './components/Viewport';
import Outliner from './components/Outliner';
import DetailsPanel from './components/DetailsPanel';
import Toolbar from './components/Toolbar/Toolbar';
import ContentBrowser from './components/ContentBrowser';

import './assets/edLayout.css';

function App(): JSX.Element {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const layout = new EditorLayout();
  layout.OpenPanel(new EditorLayoutPanel());

  return (
    <div className="edWindow">
      <div className="full-size">
        <Toolbar />
        <Split className="split split-horizontal" gutterSize={5}>
          <Split className="split" gutterSize={5} direction="vertical">
            <Viewport />
            <ContentBrowser />
          </Split>
          <div>
            <Split className="split" gutterSize={5} direction="vertical">
              <Outliner />
              <DetailsPanel />
            </Split>
          </div>
        </Split>
      </div>
    </div>
  );
}

export default App;
