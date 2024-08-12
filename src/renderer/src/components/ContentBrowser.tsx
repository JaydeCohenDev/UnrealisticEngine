import AssetManager from '@renderer/engine/AssetManager/AssetManager';
import { FileFilter } from 'electron';

export default function ContentBrowser() {
  const handleImportAsset = () => {
    const filters: FileFilter[] = AssetManager.GetSupportedImportFileFormats();
    window.api.importAsset(filters);

    console.log(window.api);
  };

  return (
    <div className="">
      <button onClick={handleImportAsset}>Import Asset</button>
    </div>
  );
}
