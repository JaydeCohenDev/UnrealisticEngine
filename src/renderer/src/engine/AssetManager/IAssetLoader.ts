export default interface IAssetLoader {
  LoadAssetFromPath(importAssetFilePath: string, filename: string): unknown;
  GetName(): string;
  GetSupportedFileExtensions(): string[];
}
