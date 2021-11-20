import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { crypt } from "../crypt";

import { mongoUri } from "../../config";

import { User, RightsLevels } from "../../interfaces/user.interface";

const client = new MongoClient(mongoUri);
const _DB_NAME = "social_network";
const _COLLECTION = "users";

class UserDB {
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
          return result as User;
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
    try {
      await client.connect();
      const collection = client.db(_DB_NAME).collection(_COLLECTION);
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
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error("Mongo error: " + err);
    }
  }

  async insertForgotLink(emailAddress: string): Promise<User | false> {
    try {
      await client.connect();
      const collection = client.db(_DB_NAME).collection(_COLLECTION);
      const isUserInDB = (await collection.findOne({
        email: emailAddress,
      })) as User | null;
      if (isUserInDB) {
        if (isUserInDB.resetLink) {
          return isUserInDB;
        }
        const linkId = uuidv4();
        const result = await collection.updateOne(
          {
            uid: isUserInDB.uid,
          },
          {
            $set: { resetLink: linkId },
          }
        );
        if (result) {
          return isUserInDB;
        }
      }
    } catch (err) {
      throw new Error("Mongo error: " + err);
    }
    return false;
  }

  async checkResetPasswordLink(rid: string): Promise<boolean> {
    try {
      await client.connect();
      const collection = client.db(_DB_NAME).collection(_COLLECTION);
      const ridInDB = await collection.findOne({
        resetLink: rid,
      });
      if (ridInDB) {
        return true;
      }
    } catch (err) {
      throw new Error("Mongo error: " + err);
    }
    return false;
  }
}

export const userDB = new UserDB();
