import { InsertOneResult, MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { mongoUri } from "../../config";

import { User, RightsLevels } from "../../interfaces/user.interface";

const client = new MongoClient(mongoUri);
const _DB_NAME = "social_network";
const _COLLECTION = "users";

export class DB {
  static async signIn(login: unknown, password: unknown): Promise<User | null> {
    await client.connect();
    const collection = client.db(_DB_NAME).collection(_COLLECTION);
    const result = await collection.findOne({
      email: login,
      password: password,
    });
    client.close();
    if (result) {
      return {
        uid: result._id,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        isConnected: result.isConnected,
        rightsLevel: result.rightsLevel,
      };
    }
    return null;
  }

  static async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dateOfBirth: string
  ): Promise<User | null> {
    await client.connect();
    const collection = client.db(_DB_NAME).collection(_COLLECTION);
    try {
      const isUserInDB = await collection.findOne({ email: email });
      console.log(isUserInDB);
      if (!isUserInDB) {
        const user: User = {
          uid: uuidv4(),
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: password,
          dateOfBirth: dateOfBirth,
          isConnected: true,
          rightsLevel: RightsLevels.MEMBER,
          creationDate: new Date(),
          lastUpdated: new Date(),
        };
        const result = await collection.insertOne(user);
        if (result) {
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error("Mongo error: " + err);
    }
  }
}
