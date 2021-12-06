import { Comment } from "./comment";

export interface Post {
  pid: string;
  uid: string;
  wallId: string;
  author: string;
  picture: string;
  content: string;
  comments?: Comment[];
  creationDate: Date;
}
