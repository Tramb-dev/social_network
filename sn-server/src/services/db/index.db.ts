import { MongoClient } from "mongodb";
import { mongoUri } from "../../config";
import { UserDB } from "./user.db";
import { PostsDB } from "./posts.db";

class DB {
  private client = new MongoClient(mongoUri);
  private readonly _DB_NAME = "social_network";
  user = new UserDB(this.client, this._DB_NAME);
  posts = new PostsDB(this.client, this._DB_NAME);
}

export const db = new DB();
