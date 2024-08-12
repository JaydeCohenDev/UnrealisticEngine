import IAssetLoader from '../IAssetLoader';

export default class TextureLoader implements IAssetLoader {
  public LoadAssetFromPath(importAssetFilePath: string, filename: string): void {
    console.log(`TEXTURE LOADER: LOADING ${importAssetFilePath} with name ${filename}`);
  }

  public GetName(): string {
    return 'Textures';
  }

  public GetSupportedFileExtensions(): string[] {
    return ['png'];
  }
}
