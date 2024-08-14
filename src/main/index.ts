import { app, shell, BrowserWindow, ipcMain, dialog, FileFilter } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import installExtension from 'electron-devtools-installer';
import * as FS from 'fs';
import * as Path from 'path';

function GetAllFilesAtPath(path: string): string[] {
  const files: string[] = [];

  FS.readdirSync(path).forEach((File) => {
    const Absolute = Path.join(path, File);
    if (FS.statSync(Absolute).isDirectory()) {
      return GetAllFilesAtPath(Absolute);
    } else return files.push(Absolute);
  });

  return files;
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: join(__dirname, '../../resources/ueLogox256.ico'),
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  ipcMain.on('importAsset', (_e, filters: FileFilter[]) => {
    dialog
      .showOpenDialog({
        properties: ['openFile'],
        title: 'Import Asset',
        buttonLabel: 'Import',
        filters: filters,
        defaultPath: join(__dirname, '../../src/renderer/src/assets')
      })
      .then((result) => {
        if (!result.canceled) {
          mainWindow.webContents.send('assetImportsRequest', result.filePaths);
        }
      });
  });

  ipcMain.on('discoverAssets', (_e) => {
    const assetDirectory = join(__dirname, '../../game/content/');
    const assetFilePaths = GetAllFilesAtPath(assetDirectory);

    const assets: any[] = [];

    assetFilePaths.forEach((assetFilePath) => {
      const data: string = FS.readFileSync(assetFilePath, { encoding: 'utf8' });
      const asset = JSON.parse(data);
      assets.push(asset);
    });

    mainWindow.webContents.send('assetsDiscovered', assets);
  });

  ipcMain.on('serializeAsset', (_e, data, assetPath) => {
    const path = join(__dirname, '../../game/content/', assetPath);
    const directory = Path.dirname(path);

    FS.mkdirSync(directory, { recursive: true });

    FS.writeFile(path, data, (err) => {
      console.log(err);
    });
  });

  mainWindow.removeMenu();

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  installExtension('fmkadmapgofadopljbjfkapdkoienihi')
    .then((name) => console.log(`Added Extension: ${name}`))
    .catch((err) => console.error('An error occured: ', err));

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  // IPC test
  ipcMain.on('ping', () => console.log('pong'));

  ipcMain.on('refresh', () => {
    BrowserWindow.getAllWindows()[0].webContents.reload();
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
