import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { mongoUri } from "../../config";
import { crypt } from "../crypt";

import { User, RightsLevels } from "../../interfaces/user.interface";

const client = new MongoClient(mongoUri);
const _DB_NAME = "social_network";
const _COLLECTION = "users";

class DB {
  async signIn(login: unknown, password: unknown): Promise<User | null> {
    await client.connect();
    const collection = client.db(_DB_NAME).collection(_COLLECTION);
    const result = await collection.findOne({
      email: login,
    });
    if (result && typeof password === "string") {
      return crypt.comparePasswords(password, result.password).then((match) => {
        if (match) {
          collection
            .updateOne(
              {
                uid: result.uid,
              },
              {
                $currentDate: { lastUpdated: true },
              }
            )
            .then(() => {
              client.close();
            });
          return {
            uid: result.uid,
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
            isConnected: result.isConnected,
            rightsLevel: result.rightsLevel,
          };
        }
        return null;
      });
    }
    client.close();
    return null;
  }

  async register(
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
      if (!isUserInDB) {
        const cryptedPassword = crypt.cryptPassword(password);
        const user: User = {
          uid: uuidv4(),
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: cryptedPassword,
          dateOfBirth: dateOfBirth,
          isConnected: true,
          rightsLevel: RightsLevels.MEMBER,
          creationDate: new Date(),
          lastUpdated: new Date(),
        };
        const result = await collection.insertOne(user);
        if (result) {
          return {
            uid: user.uid,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isConnected: user.isConnected,
            rightsLevel: user.rightsLevel,
          };
        }
      }
      return null;
    } catch (err) {
      throw new Error("Mongo error: " + err);
    }
  }
}

export const db = new DB();
