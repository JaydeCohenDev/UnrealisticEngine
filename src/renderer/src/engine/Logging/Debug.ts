import UEvent from '../UEvent';

export type LogSeverity = 'Info' | 'Warning' | 'Error' | 'Critical';

export class DebugMessage {
  protected _timeStamp: Date;
  protected _category: string;
  protected _severity: LogSeverity;
  protected _message: string;

  public constructor(timeStamp: Date, category: string, severity: LogSeverity, message: string) {
    this._timeStamp = timeStamp;
    this._category = category;
    this._severity = severity;
    this._message = message;
  }

  public get TimeStamp(): string {
    const hours = this._timeStamp.getHours().toString().padStart(2, '0');
    const minutes = this._timeStamp.getMinutes().toString().padStart(2, '0');
    const seconds = this._timeStamp.getSeconds().toString().padStart(2, '0');
    const milliseconds = this._timeStamp.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}:${milliseconds}`;
  }

  public get Category(): string {
    return this._category;
  }

  public get Severity(): LogSeverity {
    return this._severity;
  }

  public get Message(): string {
    return this._message;
  }

  public get FullMessage(): string {
    return `[${this.TimeStamp}] [${this._category.toUpperCase()}] ${this._severity}: ${this._message}`;
  }
}

export default class Debug {
  public static OnMessageLogged: UEvent = new UEvent();

  public static MessageLog: DebugMessage[] = [];

  public static Log(category: string, severity: LogSeverity, message: string): void {
    const logMessage = new DebugMessage(new Date(), category, severity, message);
    console.log(logMessage.FullMessage);
    this.MessageLog.push(logMessage);
    this.OnMessageLogged.Invoke(logMessage);
  }
}
