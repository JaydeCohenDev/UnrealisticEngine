import { ElectronAPI } from '@electron-toolkit/preload';
import { FileFilter } from 'electron';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      refresh: () => void;
      importAsset: (filters: FileFilter[]) => void;
      assetImportsRequest: (callback: (filePaths: string[]) => void) => void;
    };
  }
}
