import { MongoClient } from "mongodb";
import { mongoUri } from "../../config";
import { userDB } from "./user.db";

const client = new MongoClient(mongoUri);
const _DB_NAME = "social_network";
const _COLLECTION = "users";

/* const DB = function () {};
DB.prototype = userDB; */

class DB {
  user = userDB;
}

export const db = new DB();
