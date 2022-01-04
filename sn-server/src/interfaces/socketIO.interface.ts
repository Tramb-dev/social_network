export interface ServerToClientEvents {
  noArg: () => void;
  test: (str: string) => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  newMessage: (msg: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}
