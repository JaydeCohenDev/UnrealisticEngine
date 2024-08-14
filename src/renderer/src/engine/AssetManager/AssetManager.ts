import { FileFilter } from 'electron';
import UAsset from '../Asset';
import { UFunction } from '../Decorators';
import IAssetLoader from './IAssetLoader';
import { SubclassOf } from '../Class';

export default class AssetManager {
  protected static _loaders: IAssetLoader[] = [];
  protected static _loaderExtensionLookup: { [id: string]: IAssetLoader } = {};
  protected static _loadedAssets: { [id: string]: UAsset } = {};

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

  public static GetAsset<T extends UAsset>(assetPath: string): T {
    console.log(AssetManager._loadedAssets);
    return AssetManager._loadedAssets[assetPath] as T;
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

  public static FindAssetById<T extends UAsset>(id: string): T | undefined {
    if (id in AssetManager._loadedAssets) {
      return AssetManager._loadedAssets[id] as T;
    }
    return undefined;
  }

  public static CreateAsset(asset: UAsset) {
    // create .uasset file on disk
    const data = JSON.stringify(asset);

    const path = asset.Name;
    window.api.serializeAsset(data, path);

    // register the new asset
    AssetManager._loadedAssets[path] = asset;
  }

  public static RegiserAsset(asset: UAsset) {
    // load a .uasset from disk into loaded assets map
    console.log(`registering asset found on disk ${asset.SrcPath}`);
    AssetManager._loadedAssets[asset.Name] = asset;
  }
}
