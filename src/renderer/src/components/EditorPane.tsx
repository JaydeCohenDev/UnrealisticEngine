import { EditorLayoutPane } from '@renderer/engine/EdLayout/EditorLayout';
import Split from 'react-split';

interface IEditorPaneProps {
  layout: EditorLayoutPane;
}

export default function EditorPane(props: IEditorPaneProps) {
  if (props.layout.HasSplit()) {
    if (props.layout.GetSplitDirection() == 'horizontal') {
      return (
        <Split className="split split-horizontal" gutterSize={5}>
          <EditorPane layout={props.layout.GetContentInSlot(0)} />
          <EditorPane layout={props.layout.GetContentInSlot(1)} />
        </Split>
      );
    } else if (props.layout.GetSplitDirection() == 'vertical') {
      return (
        <Split className="split" gutterSize={5} direction="vertical">
          <EditorPane layout={props.layout.GetContentInSlot(0)} />
          <EditorPane layout={props.layout.GetContentInSlot(1)} />
        </Split>
      );
    }
  } else {
    const ContentComponent = props.layout.GetComponent();
    return <ContentComponent />;
  }

  return <>invalid editor pane!</>;
}
