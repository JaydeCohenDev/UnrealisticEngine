import UERenderContext from './UERenderContext';

export function CreateRenderContext(): UERenderContext {
  const canvas = document.querySelector('#viewport') as HTMLCanvasElement;
  return new UERenderContext(canvas);
}
