import { MongoClient, Collection, Document, UpdateResult } from "mongodb";
import { v4 as uuidv4 } from "uuid";

import { Post } from "../../interfaces/post.interface";

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
  async getAllWallPosts(wallId: string): Promise<Post[]> {
    try {
      await this.client.connect();
      const collection = this.client
        .db(this._DB_NAME)
        .collection(this._COLLECTION);
      const result = (await collection
        .find({
          wallId,
        })
        .sort({ _id: -1 })
        .limit(10)
        .project({ _id: 0 })
        .toArray()) as Post[];
      this.client.close();
      return result;
    } catch (err) {
      throw new Error("Error getting all wall posts: " + JSON.stringify(err));
    }
  }
}
