export interface Message {
  mId: string;
  uId: string;
  date: Date;
  content: string;
}

export interface NewMessage {
  message: Message;
  dId: string;
  uid: string;
}
