export interface Message {
  mid: string;
  uid: string;
  date: Date;
  content: string;
  author: string;
}

export interface NewMessage {
  message: Message;
  dId: string;
  uid: string;
}
