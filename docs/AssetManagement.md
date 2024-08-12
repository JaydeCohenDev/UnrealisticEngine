## Goals

- Maintain src asset path & be reimportable
- Be indexed
- Assets to be searchable/scannable at runtime
- Use the platform folder structure
- Thumbnails
- Metadata
- Custom editors
- Serialization (binary or text)

## unity approach

a file (asset) in your project folder structure.
along side that exists a \*.meta file. <- asset meta data

mytexture.png
mytexture.meta

pros

- the src file is untainted

cons
-theres 2 files to keep in sync

## unreal approach

import src file to content browser, saves as custom uasset format

mytexture.uasset

pros

- only 1 file to manage

cons

- custom serializer, less cross compatible.
