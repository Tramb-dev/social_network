import { Message } from "./message.interface";

export interface Discussion {
  dId: string;
  messages: Message[];
  users: string[];
  privateDiscussion: boolean;
  owner?: string;
}
