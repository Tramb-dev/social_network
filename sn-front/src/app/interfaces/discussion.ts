import { Message } from "./message";

export interface Discussion {
  dId: string;
  users: string[];
  privateMessage: boolean;
  messages: Message[];
  authors?: string[];
}
