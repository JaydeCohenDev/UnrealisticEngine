import { Timer } from 'three/examples/jsm/addons';

export default class Time {
  public static TickTimer: Timer = new Timer();

  public static GetGameTimeInSeconds(): number {
    return Time.TickTimer.getElapsed();
  }

  public static GetWorldDeltaSeconds(): number {
    return Time.TickTimer.getDelta();
  }

  public static GetFrameRate(): number {
    return 1.0 / Time.GetWorldDeltaSeconds();
  }
}
