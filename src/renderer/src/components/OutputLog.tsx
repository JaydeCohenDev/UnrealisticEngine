import Debug, { DebugMessage } from '@renderer/engine/Logging/Debug';

import '../assets/outputLog.css';
import { useEffect, useRef, useState } from 'react';

export default function OutputLog() {
  const [messages, setMessages] = useState<DebugMessage[]>([]);

  const logPanel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Debug.OnMessageLogged.AddListener(() => {
      setMessages(
        Debug.MessageLog.filter((_) => {
          return true;
        })
      );
    });
    setMessages(Debug.MessageLog);
  }, []);

  useEffect(() => {
    if (logPanel.current === null) return;

    logPanel.current.scrollTop = logPanel.current.scrollHeight;
  }, [messages]);

  return (
    <div className="logPanel" ref={logPanel}>
      {messages.map((message, _index) => {
        return (
          <div
            className={
              'logRow ' +
              (message.Severity === 'Warning'
                ? 'logWarning'
                : message.Severity === 'Error'
                  ? 'logError'
                  : '')
            }
            key={_index}
          >
            {message.FullMessage}
          </div>
        );
      })}
    </div>
  );
}
