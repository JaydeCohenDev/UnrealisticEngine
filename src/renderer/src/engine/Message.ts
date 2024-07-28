type CallbackFunction = (data: any) => void;

export default class Message {
  protected static _listeners: { [messageId: string]: CallbackFunction[] } = {};

  public static Send(messageId: string, data: any) {
    if (Message._listeners[messageId] === undefined) return;

    Message._listeners[messageId].forEach((callback: CallbackFunction) => {
      callback(data);
    });
  }

  public static AddListener(messageId: string, callback: CallbackFunction) {
    if (Message._listeners[messageId] === undefined) Message._listeners[messageId] = [];

    Message._listeners[messageId].push(callback);
  }

  public static RemoveLister(messageId: string, callback: CallbackFunction) {
    if (Message._listeners[messageId] === undefined) return;

    Message._listeners[messageId] = Message._listeners[messageId].filter((c) => {
      return c !== callback;
    });
  }
}
