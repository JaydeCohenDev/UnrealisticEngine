import Split from 'react-split';
import { EditorLayout, EditorLayoutPane } from './engine/EdLayout/EditorLayout';
import EditorPane from './components/EditorPane';
import Viewport from './components/Viewport';
import Outliner from './components/Outliner';
import DetailsPanel from './components/DetailsPanel';
import Toolbar from './components/Toolbar/Toolbar';
import ContentBrowser from './components/ContentBrowser';

import './assets/edLayout.css';

function App(): JSX.Element {
  //const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const layout = new EditorLayout();
  layout
    .GetRootPane()
    .Split(
      'horizontal',
      new EditorLayoutPane().Split(
        'vertical',
        new EditorLayoutPane(Viewport),
        new EditorLayoutPane(ContentBrowser)
      ),
      new EditorLayoutPane().Split(
        'vertical',
        new EditorLayoutPane(Outliner),
        new EditorLayoutPane(DetailsPanel)
      )
    );

  return (
    <div className="edWindow">
      <div className="full-size">
        <Toolbar />

        <EditorPane layout={layout.GetRootPane()} />
      </div>
    </div>
  );
}

export default App;
