import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";

import { Post } from "../../interfaces/post.interface";
import { User } from "../../interfaces/user.interface";

export class PostsDB {
  private client: MongoClient;
  private _DB_NAME: string;
  private readonly _COLLECTION = "posts";

  constructor(client: MongoClient, dbName: string) {
    this.client = client;
    this._DB_NAME = dbName;
  }

  /**
   * Get all the posts corresponding to a wallId (a user can post on the wall of another user)
   * @param wallId
   * @returns A promise containing an array of all the corresponding posts
   */
  getAllWallPosts(wallId: string): Promise<Post[]> {
    return this.client
      .connect()
      .then(() => {
        return this.client
          .db(this._DB_NAME)
          .collection(this._COLLECTION)
          .find({
            wallId,
          })
          .sort({ _id: -1 })
          .limit(10)
          .project<Post>({ _id: 0 })
          .toArray()
          .catch((err) => {
            throw new Error("Error getting all wall posts: " + err);
          });
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * Get a limited number of post from a user
   * @param uid
   * @returns
   */
  getUserPosts(uid: string): Promise<Post[]> {
    return this.client
      .connect()
      .then(() => {
        return this.client
          .db(this._DB_NAME)
          .collection(this._COLLECTION)
          .find({ uid })
          .sort({ _id: -1 })
          .limit(5)
          .project<Post>({ _id: 0 })
          .toArray()
          .then((posts) => posts)
          .catch((err) => {
            throw new Error(
              "Error getting this friend posts: " + uid + " " + err
            );
          });
      })
      .catch((err) => {
        throw err;
      });
  }

  async addPost(
    wallId: string,
    user: User,
    content: string
  ): Promise<Post | null> {
    const doc = {
      wallId,
      uid: user.uid,
      pid: uuidv4(),
      author: `${user.firstName} ${user.lastName}`,
      content,
      creationDate: new Date(),
    };
    const collection = this.client
      .db(this._DB_NAME)
      .collection(this._COLLECTION);
    try {
      await this.client.connect();
      const result = await collection.insertOne(doc);
      if (result.acknowledged) {
        return await collection.findOne<Post>({ _id: result.insertedId });
      }
      return null;
    } catch (err) {
      throw new Error("Unable to add a new post " + err);
    }
  }

  async addComment(
    pid: string,
    user: User,
    content: string
  ): Promise<Post | null> {
    const collection = this.client
      .db(this._DB_NAME)
      .collection(this._COLLECTION);
    try {
      await this.client.connect();
      const result = await collection.updateOne(
        {
          pid,
        },
        {
          $push: {
            comments: {
              uid: user.uid,
              author: `${user.firstName} ${user.lastName}`,
              content,
              creationDate: new Date(),
            },
          },
        }
      );
      if (result.modifiedCount === 1) {
        return await collection.findOne<Post>({ pid });
      }
      return null;
    } catch (err) {
      throw new Error("unable to add a new comment " + err);
    }
  }

  async deletePost(pid: string): Promise<boolean> {
    const collection = this.client
      .db(this._DB_NAME)
      .collection(this._COLLECTION);
    try {
      await this.client.connect();
      const result = await collection.deleteOne({
        pid,
      });
      if (result.acknowledged && result.deletedCount === 1) {
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  }

  /**
   * Retrieve a specified post
   * @param pid the post id to retrieve
   * @returns The post or null if it does not exists
   */
  getPost(pid: string): Promise<Post | null> {
    return this.client
      .connect()
      .then(() => {
        const collection = this.client
          .db(this._DB_NAME)
          .collection(this._COLLECTION);
        return collection.findOne<Post>({ pid });
      })
      .catch((err: Error) => {
        throw err;
      });
  }
}
