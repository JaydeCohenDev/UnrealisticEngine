import { useEffect, useRef, useState } from 'react';
import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api';

export default function CodeEditor() {
  const [editor, setEditor] = useState<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const codePanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (codePanel) {
      setEditor((editor) => {
        if (editor) return editor;

        return Monaco.editor.create(codePanel.current!, {
          value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
          language: 'javascript',
          theme: 'vs-dark',
          automaticLayout: true
        });
      });
    }

    return () => editor?.dispose();
  }, [codePanel.current]);

  return <div ref={codePanel} style={{ width: '100%', height: '100%' }}></div>;
}
