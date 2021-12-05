import { Comment } from "./comment";

export interface Post {
  id: string;
  name: string;
  pictureUrl: string;
  pictureAlt: string;
  content: string;
  comments?: Comment[];
}
