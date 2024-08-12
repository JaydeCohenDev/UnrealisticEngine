import { contextBridge, FileFilter, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';

// Custom APIs for renderer
const api = {
  refresh: () => ipcRenderer.send('refresh'),
  importAsset: (filters: FileFilter[]) => ipcRenderer.send('importAsset', filters),
  assetImportsRequest: (callback) =>
    ipcRenderer.on('assetImportsRequest', (_e, filePaths) => callback(filePaths))
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
