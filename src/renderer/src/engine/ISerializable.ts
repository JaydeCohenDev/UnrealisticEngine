export default interface ISerializable {
  Serialize(): string;
  Deserialize(data: string): boolean;
}
