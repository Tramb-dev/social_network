import { MongoClient, Collection, Document, UpdateResult } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { Crypt } from "../crypt";

import { User, RightsLevels } from "../../interfaces/user.interface";

interface SigninCredentials {
  email: string;
  password?: string;
  uid?: string;
}

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
    await this.client.connect();
    const collection = this.client
      .db(this._DB_NAME)
      .collection(this._COLLECTION);
    let result: Document | null;
    if (creds.uid && creds.email) {
      result = await collection.findOne({
        email: creds.email,
        uid: creds.uid,
      });
      if (result) {
        this.updateDateField(collection, result.uid).then(() => {
          this.client.close();
        });
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
          this.updateDateField(collection, result.uid).then(() => {
            this.client.close();
          });
          return result as User;
        }
      }
      return null;
    }
    this.client.close();
    return null;
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
    try {
      await this.client.connect();
      const collection = this.client
        .db(this._DB_NAME)
        .collection(this._COLLECTION);
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
    try {
      await this.client.connect();
      const collection = this.client
        .db(this._DB_NAME)
        .collection(this._COLLECTION);
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
    try {
      await this.client.connect();
      const collection = this.client
        .db(this._DB_NAME)
        .collection(this._COLLECTION);
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
          this.client.close();
          if (result.modifiedCount) {
            return true;
          }
        } else {
          throw new Error("Reset link is expired");
        }
      }
      this.client.close();
      return false;
    } catch (err) {
      throw new Error("Mongo error: " + JSON.stringify(err));
    }
  }

  /**
   * Retrieves the picture of the user to inject on the corresponding posts
   * @param uid The user id from whom we gather the picture
   * @returns A promise with the picture url, or null if there is no picture
   */
  getProfilPicture(uid: string): Promise<string | null> {
    return this.client.connect().then(() => {
      const collection = this.client
        .db(this._DB_NAME)
        .collection(this._COLLECTION);
      return collection.findOne({ uid }).then((doc) => {
        this.client.close();
        const user = doc as User;
        if (user && user.picture) {
          return user.picture;
        }
        return null;
      });
    });
  }
}
