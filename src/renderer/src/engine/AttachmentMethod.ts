export type AttachmentMethod = 'SnapToTarget' | 'KeepRelative' | 'KeepWorld';
export type TransformAttachmentRules = {
  position: AttachmentMethod;
  rotation: AttachmentMethod;
  scale: AttachmentMethod;
};
