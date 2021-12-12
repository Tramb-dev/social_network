import { MongoClient, Collection, Document, UpdateResult } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { Crypt } from "../crypt";

import {
  User,
  RightsLevels,
  SigninCredentials,
  RandomUser,
} from "../../interfaces/user.interface";

export class UserDB extends Crypt {
  private readonly _expirationTime = 48 * 3600 * 1000;
  private readonly _COLLECTION = "users";
  private client: MongoClient;
  private _DB_NAME: string;

  constructor(client: MongoClient, dbName: string) {
    super();
    this.client = client;
    this._DB_NAME = dbName;
  }

  /**
   * Sign in the user, with credentials or a token
   * @param creds An object containing the email address and the password, or a token
   * @returns A promise with the user or null if something goes wrong
   */
  async signIn(creds: SigninCredentials): Promise<User | null> {
    const collection = this.client
      .db(this._DB_NAME)
      .collection(this._COLLECTION);
    let result: Document | null;
    try {
      await this.client.connect();
      if (creds.uid && creds.email) {
        result = await collection.findOne({
          email: creds.email,
          uid: creds.uid,
        });
        if (result) {
          this.updateDateField(collection, result.uid);
          return result as User;
        }
        return null;
      } else if (creds.email && creds.password) {
        result = await collection.findOne({
          email: creds.email,
        });
        if (result) {
          const match = this.comparePasswords(creds.password, result.password);
          if (match) {
            this.updateDateField(collection, result.uid);
            return result as User;
          }
        }
      }
      return null;
    } catch (err) {
      throw new Error("Cannot sign in user " + err);
    }
  }

  /**
   * Update the user's date field each time a connexion is done
   * @param collection the collection to update
   * @param uid the user uid
   * @returns A promise with the update result
   */
  private async updateDateField(
    collection: Collection<Document>,
    uid: string
  ): Promise<UpdateResult> {
    return collection.updateOne(
      {
        uid,
      },
      {
        $currentDate: { lastUpdated: true },
      }
    );
  }

  /**
   * Register a new user in db
   * @param firstName
   * @param lastName
   * @param email
   * @param password
   * @param dateOfBirth
   * @returns
   */
  async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dateOfBirth: string
  ): Promise<User | null> {
    const collection = this.client
      .db(this._DB_NAME)
      .collection(this._COLLECTION);
    try {
      await this.client.connect();
      const isUserInDB = await collection.findOne({ email: email });
      if (!isUserInDB) {
        const cryptedPassword = this.cryptPassword(password);
        const uid = uuidv4();
        const user: User = {
          uid,
          email,
          firstName,
          lastName,
          password: cryptedPassword,
          dateOfBirth,
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

  /**
   * Add a reset link to help the user to reset its password.
   * @param emailAddress The email address to attach to the reset link
   * @returns A promise with the user or null if something wrong
   */
  async insertForgotLink(emailAddress: string): Promise<User | null> {
    const collection = this.client
      .db(this._DB_NAME)
      .collection(this._COLLECTION);
    try {
      await this.client.connect();
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
    return null;
  }

  /**
   * Check if the reset link provided is present in db
   * @param rid The reset link to check
   * @returns A promise with true if the link is good or false otherwise
   */
  async checkResetPasswordLink(rid: string): Promise<boolean> {
    try {
      await this.client.connect();
      const collection = this.client
        .db(this._DB_NAME)
        .collection(this._COLLECTION);
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

  /**
   * Change the user's password
   * @param newPassword The new password to save
   * @param rid the reset link corresponding
   * @returns A promise with a boolean, if the operation ran successfuly or not
   */
  async changePassword(newPassword: string, rid: string): Promise<boolean> {
    const collection = this.client
      .db(this._DB_NAME)
      .collection(this._COLLECTION);
    try {
      await this.client.connect();
      const find = await collection.findOne({ resetLink: rid });
      if (find && find.resetTime) {
        if (find.resetTime + this._expirationTime > Date.now()) {
          const cryptedPassword = this.cryptPassword(newPassword);
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

  /**
   * Retrieves a user
   *
   * @param uid The user id
   * @returns A promise with the user, or null
   */
  getUser(uid: string): Promise<User | null> {
    return this.client
      .connect()
      .then(() => {
        return this.client
          .db(this._DB_NAME)
          .collection(this._COLLECTION)
          .findOne({ uid })
          .then((doc) => {
            return doc as User;
          })
          .catch((err) => {
            throw new Error("Cannot find user " + err);
          });
      })
      .catch((err) => {
        throw new Error("Mongo error: " + err);
      });
  }

  /**
   * Retieves all users
   * @returns A promise with the users, or null
   */
  getUsers(): Promise<User[] | null> {
    return this.client
      .connect()
      .then(() => {
        return this.client
          .db(this._DB_NAME)
          .collection(this._COLLECTION)
          .find({})
          .toArray()
          .then((doc) => {
            return doc as User[] | null;
          })
          .catch((err) => {
            throw new Error("Cannot find user " + err);
          });
      })
      .catch((err) => {
        throw new Error("Mongo error: " + err);
      });
  }
}
