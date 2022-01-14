import { Message } from "./message";

export interface Discussion {
  dId: string;
  users: string[];
  privateMessage: boolean;
  messages: Message[];
  authors?: string[];
  owner?: string;
  lastUpdate: Date;
}

export interface NewMessageResponseCallback {
  status: string;
  mid?: string;
}
