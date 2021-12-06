export interface Post {
  pid: string;
  uid: string;
  wallId: string;
  author: string;
  picture?: string;
  content: string;
  comments?: Comment[];
  creationDate: Date;
}

interface Comment {
  cid: string;
  uid: string;
  author: string;
  content: string;
  creationDate: Date;
}
