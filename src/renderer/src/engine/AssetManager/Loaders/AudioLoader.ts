import IAssetLoader from '../IAssetLoader';

export default class AudioLoader implements IAssetLoader {
  public LoadAssetFromPath(importAssetFilePath: string, filename: string): void {
    console.log(`AUDIO LOADER: LOADING ${importAssetFilePath} with name ${filename}`);
  }

  public GetName(): string {
    return 'Audio';
  }

  public GetSupportedFileExtensions(): string[] {
    return ['wav', 'ogg'];
  }
}
