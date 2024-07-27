import * as Engine from '@renderer/engine/Engine';
import { useEffect } from 'react';

export default function Viewport() {
  useEffect(() => {
    Engine.CreateRenderContext();
  }, []);

  return (
    <div className="viewport">
      <canvas id="viewport"></canvas>
    </div>
  );
}
