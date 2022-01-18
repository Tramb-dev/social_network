import { Message } from "./message.interface";

export interface ServerToClientEvents {
  noArg: () => void;
  test: (str: string) => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  newMessage: (data: { message: Message; dId: string; uid: string }) => void;
  roomJoined: (message: string) => void;
  deletedMessage: (data: { mid: string; dId: string }) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  messageReceived: (
    content: string,
    dId: string,
    uid: string,
    callback: (res: NewMessageResponseCallback) => void
  ) => void;
  joinRoom: (roomId: string) => void;
  deleteMessage: (mid: string, dId: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface NewMessageResponseCallback {
  status: string;
  mid?: string;
  error?: string;
}
