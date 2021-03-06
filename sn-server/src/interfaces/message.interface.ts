export interface Message {
  mid: string;
  uid: string;
  content: string;
  date: Date;
  author: string;
  deleted?: boolean;
}
