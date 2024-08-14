import Texture2d from '@renderer/engine/Texture2d';
import IAssetLoader from '../IAssetLoader';
import { TextureLoader as THREETextureLoader } from 'three';
import AssetManager from '../AssetManager';

export default class TextureLoader implements IAssetLoader {
  public LoadAssetFromPath(importAssetFilePath: string, filename: string): void {
    const loader = new THREETextureLoader();
    const newTextureAsset = new Texture2d(filename, loader.load(importAssetFilePath));
    newTextureAsset.SrcPath = importAssetFilePath;
    AssetManager.CreateAsset(newTextureAsset);
  }

  public GetName(): string {
    return 'Textures';
  }

  public GetSupportedFileExtensions(): string[] {
    return ['png'];
  }
}
