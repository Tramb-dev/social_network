export interface Message {
  mid: string;
  uid: string;
  date: Date;
  content: string;
  author: string;
  deleted?: boolean;
}

export interface NewMessage {
  message: Message;
  dId: string;
  uid: string;
}
