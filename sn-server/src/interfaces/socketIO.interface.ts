import { Message } from "./message.interface";

export interface ServerToClientEvents {
  noArg: () => void;
  test: (str: string) => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  newMessage: (message: Message, uid: string) => void;
  roomJoined: (message: string) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  messageReceived: (content: string, dId: string, uid: string) => void;
  joinRoom: (roomId: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}
