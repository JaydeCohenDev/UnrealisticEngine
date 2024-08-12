import { FileFilter } from 'electron';
import AssetBase from '../Asset';
import { UFunction } from '../Decorators';
import IAssetLoader from './IAssetLoader';
import { SubclassOf } from '../Class';

export default class AssetManager {
  protected static _loaders: IAssetLoader[] = [];
  protected static _loaderExtensionLookup: { [id: string]: IAssetLoader } = {};
  protected static _assets: { [id: string]: AssetBase } = {};

  @UFunction({ meta: ['EditorOnly'] })
  public static ScanForAssets(): void {}

  public static GetSupportedImportFileFormats(): FileFilter[] {
    const filters: FileFilter[] = [];

    AssetManager._loaders.forEach((loader: IAssetLoader) => {
      const extensions = loader.GetSupportedFileExtensions();

      extensions.forEach((ext) => {
        // TODO check for extension conflicts
        AssetManager._loaderExtensionLookup[ext] = loader;
      });

      filters.push({
        name: loader.GetName(),
        extensions: extensions
      });
    });

    return filters;
  }

  public static RegisterLoader(loader: SubclassOf<IAssetLoader>) {
    AssetManager._loaders.push(new loader());
  }

  public static ImportAssetFromPath(importAssetFilePath: string) {
    // dont ever touch again
    const [filename, ext] = importAssetFilePath.split('\\').pop()?.split('.') ?? [];

    const loader = AssetManager._loaderExtensionLookup[ext];
    if (loader !== undefined) {
      loader.LoadAssetFromPath(importAssetFilePath, filename);
    }
  }

  public static FindAssetById<T extends AssetBase>(id: string): T | undefined {
    if (id in AssetManager._assets) {
      return AssetManager._assets[id] as T;
    }
    return undefined;
  }

  public static RegiserAsset() {}
}
