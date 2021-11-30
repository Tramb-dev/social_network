import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { crypt } from "../crypt";

import { mongoUri } from "../../config";

import { User, RightsLevels } from "../../interfaces/user.interface";

const client = new MongoClient(mongoUri);

class UserDB {
  private readonly _expirationTime = 48 * 3600 * 1000;
  private readonly _DB_NAME = "social_network";
  private readonly _COLLECTION = "users";

  async signIn(login: string, password: string): Promise<User | null> {
    await client.connect();
    const collection = client.db(this._DB_NAME).collection(this._COLLECTION);
    const result = await collection.findOne({
      email: login,
    });
    if (result) {
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
      const collection = client.db(this._DB_NAME).collection(this._COLLECTION);
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
      const collection = client.db(this._DB_NAME).collection(this._COLLECTION);
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
            $set: {
              resetLink: linkId,
              resetTime: Date.now(),
            },
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
      const collection = client.db(this._DB_NAME).collection(this._COLLECTION);
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

  async changePassword(newPassword: string, rid: string): Promise<boolean> {
    try {
      await client.connect();
      const collection = client.db(this._DB_NAME).collection(this._COLLECTION);
      const find = await collection.findOne({ resetLink: rid });
      if (find && find.resetTime) {
        if (find.resetTime + this._expirationTime > Date.now()) {
          const cryptedPassword = crypt.cryptPassword(newPassword);
          const result = await collection.updateOne(
            {
              resetLink: rid,
            },
            {
              $set: {
                password: cryptedPassword,
              },
              $unset: {
                resetLink: 1,
                resetTime: 1,
              },
            }
          );
          if (result.modifiedCount) {
            return true;
          }
        } else {
          throw new Error("Reset link is expired");
        }
      }
      return false;
    } catch (err) {
      throw new Error("Mongo error: " + err);
    }
  }
}

export const userDB = new UserDB();
