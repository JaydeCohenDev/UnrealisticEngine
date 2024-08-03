export default class FMath {
  public static MapRange(
    value: number,
    rangeInMin: number,
    rangeInMax: number,
    rangeOutMin: number,
    rangeOutMax: number
  ) {
    return (
      rangeOutMin + ((rangeOutMax - rangeOutMin) * (value - rangeInMin)) / (rangeInMax - rangeInMin)
    );
  }

  public static Clamp(value: number, min: number, max: number) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }
}
