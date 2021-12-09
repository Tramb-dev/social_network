import { MongoClient } from "mongodb";
import { UserDB } from "./user.db";
import { PostsDB } from "./posts.db";

import { mongoUri } from "../../config";
import { Post } from "../../interfaces/post.interface";

class DB {
  private client = new MongoClient(mongoUri);
  private readonly _DB_NAME = "social_network";
  user = new UserDB(this.client, this._DB_NAME);
  posts = new PostsDB(this.client, this._DB_NAME);

  async getAllWallPosts(wallId: string): Promise<Post[]> {
    const promises: Promise<Post>[] = [];
    await this.client.connect();
    const posts = await this.posts.getAllWallPosts(wallId);
    posts.forEach((post) => {
      promises.push(this.addPicture(post));
    });

    const postsWithPictures = await Promise.all(promises);
    return postsWithPictures;
  }

  async addPost(
    wallId: string,
    uid: string,
    content: string
  ): Promise<Post | null> {
    const user = await this.user.getUser(uid);
    if (user) {
      const post = await this.posts.addPost(wallId, user, content);
      if (post) {
        return await this.addPicture(post);
      }
    }
    return null;
  }

  async addComent(
    pid: string,
    uid: string,
    content: string
  ): Promise<Post | null> {
    const user = await this.user.getUser(uid);
    if (user) {
      const post = await this.posts.addComment(pid, user, content);
      if (post) {
        return await this.addPicture(post);
      }
    }
    return null;
  }

  private addPicture(post: Post): Promise<Post> {
    return this.user.getUser(post.uid).then((user) => {
      if (user && user.picture) {
        post.picture = user.picture;
      }
      return post;
    });
  }
}

export const db = new DB();
