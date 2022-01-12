import { MongoClient } from "mongodb";
import { UserDB } from "./user.db";
import { PostsDB } from "./posts.db";
import { DiscussionsDB } from "./discussions.db";

import { mongoUri } from "../../config";
import { Post } from "../../interfaces/post.interface";
import { Message } from "../../interfaces/message.interface";
import { Discussion } from "../../interfaces/discussion.interface";

class DB {
  private client = new MongoClient(mongoUri);
  private readonly _DB_NAME = "social_network";
  user = new UserDB(this.client, this._DB_NAME);
  posts = new PostsDB(this.client, this._DB_NAME);
  discussions = new DiscussionsDB(this.client, this._DB_NAME);

  async getAllWallPosts(wallId: string): Promise<Post[]> {
    const promises: Promise<Post>[] = [];
    const posts = await this.posts.getAllWallPosts(wallId);
    posts.forEach((post) => {
      promises.push(this.addPicture(post));
    });

    return await Promise.all(promises);
  }

  getAllFriendsPosts(uid: string): Promise<Post[] | null> {
    const promises: Promise<Post[]>[] = [];
    return this.user
      .getUser(uid)
      .then((user) => {
        if (user && user.friends && user.friends.length > 0) {
          user.friends.forEach((friend) => {
            promises.push(
              this.posts.getUserPosts(friend).then((posts) => {
                const picturesPromises: Promise<Post>[] = [];
                posts.forEach((post) => {
                  picturesPromises.push(this.addPicture(post));
                });
                return Promise.all(picturesPromises);
              })
            );
          });
          return Promise.all(promises).then((allPosts) => {
            let posts: Post[] = [];
            allPosts.forEach((friendPosts) => {
              posts = posts.concat(friendPosts);
            });
            posts.sort((a, b) =>
              this.compareDates(b.creationDate, a.creationDate)
            );
            return posts;
          });
        }
        return null;
      })
      .catch((err) => {
        throw err;
      });
  }

  addNewMessage(dId: string, uid: string, content: string): Promise<Message> {
    return this.user
      .getUser(uid)
      .then((user) => {
        if (user) {
          const name = `${user.firstName} ${user.lastName}`;
          return this.discussions.addNewMessage(dId, uid, name, content);
        } else {
          throw new Error("User not found");
        }
      })
      .catch((err: Error) => {
        throw err;
      });
  }

  private compareDates(firstDate: Date, secondDate: Date): number {
    return firstDate.getTime() - secondDate.getTime();
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
