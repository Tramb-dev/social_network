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
    let result: User | null;
    try {
      await this.client.connect();
      if (creds.uid && creds.email) {
        result = await collection.findOne<User>({
          email: creds.email,
          uid: creds.uid,
        });
        if (result) {
          this.updateDateField(collection, result.uid);
          return result;
        }
        return null;
      } else if (creds.email && creds.password) {
        result = await collection.findOne<User>({
          email: creds.email,
        });
        if (result) {
          const match = this.comparePasswords(creds.password, result.password);
          if (match) {
            this.updateDateField(collection, result.uid);
            return result;
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
      const isUserInDB = await collection.findOne<User>({ email: email });
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
          picture: "assets/images/default-user.jpg",
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
      const isUserInDB = await collection.findOne<User>({
        email: emailAddress,
      });
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
      const ridInDB = await collection.findOne<User>({
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
      const find = await collection.findOne<User>({ resetLink: rid });
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
      throw err;
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
          .findOne<User>({ uid })
          .then((doc) => {
            return doc;
          })
          .catch((err) => {
            throw new Error("Cannot find user " + err);
          });
      })
      .catch((err) => {
        throw err;
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
          .find<User>({})
          .toArray()
          .then((doc) => {
            return doc;
          })
          .catch((err) => {
            throw new Error("Cannot find user " + err);
          });
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * Retieves all friends for a given user
   * @returns A promise with the users, or null
   */
  getFriends(uid: string): Promise<User[] | null> {
    return this.client
      .connect()
      .then(() => {
        const collection = this.client
          .db(this._DB_NAME)
          .collection(this._COLLECTION);
        return collection.findOne<User>({ uid }).then((user) => {
          const friends = user?.friends;
          if (friends && friends.length > 0) {
            return collection
              .find<User>({})
              .toArray()
              .then((doc) => {
                return doc;
              })
              .catch((err) => {
                throw new Error("Cannot find user " + err);
              });
          } else {
            return null;
          }
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * Add a friend request in the current user and in the friend user
   * @param uid the current user id demanding to be friend with another user
   * @param friendUid the user id to send a friend request
   * @returns True if the update was successful, false otherwise
   */
  addFriendRequest(uid: string, friendUid: string): Promise<boolean> {
    return this.client
      .connect()
      .then(() => {
        const collection = this.client
          .db(this._DB_NAME)
          .collection(this._COLLECTION);
        const findUsersPromises: Promise<User | null>[] = [];
        findUsersPromises.push(collection.findOne<User>({ uid }));
        findUsersPromises.push(collection.findOne<User>({ uid: friendUid }));

        return Promise.all(findUsersPromises)
          .then(([currentUser, friendUser]) => {
            if (currentUser && friendUser) {
              if (
                (!currentUser.sendedFriendRequests ||
                  !currentUser.sendedFriendRequests.includes(friendUid)) &&
                (!friendUser.receivedFriendRequests ||
                  !friendUser.receivedFriendRequests.includes(uid))
              ) {
                const updateUsersPromises: Promise<UpdateResult>[] = [];
                updateUsersPromises.push(
                  collection.updateOne(
                    {
                      uid,
                    },
                    {
                      $push: {
                        sendedFriendRequests: friendUid,
                      },
                    }
                  )
                );
                updateUsersPromises.push(
                  collection.updateOne(
                    {
                      uid: friendUid,
                    },
                    {
                      $push: {
                        receivedFriendRequests: uid,
                      },
                    }
                  )
                );

                return Promise.all(updateUsersPromises)
                  .then(([userResult, friendResult]) => {
                    if (
                      1 === userResult.modifiedCount &&
                      1 === friendResult.modifiedCount
                    ) {
                      return true;
                    }
                    return false;
                  })
                  .catch((err) => {
                    throw err;
                  });
              }
              return false;
            }
            throw new Error("User not found");
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * Transform friend requests to friendship.
   * Add the users to friends array. Removes them from received and sended requests arrays
   * @param uid the user who accepted the invitation
   * @param friendUid the user who sended the invitation
   * @returns True if the update was successful, false otherwise
   */
  convertInvitationToFriendship(
    uid: string,
    friendUid: string
  ): Promise<boolean> {
    return this.client
      .connect()
      .then(() => {
        const collection = this.client
          .db(this._DB_NAME)
          .collection(this._COLLECTION);
        const findUsersPromises: Promise<User | null>[] = [];
        findUsersPromises.push(collection.findOne<User>({ uid }));
        findUsersPromises.push(collection.findOne<User>({ uid: friendUid }));

        return Promise.all(findUsersPromises)
          .then(([currentUser, friendUser]) => {
            if (currentUser && friendUser) {
              if (
                currentUser.receivedFriendRequests?.includes(friendUid) &&
                friendUser.sendedFriendRequests?.includes(uid)
              ) {
                const updateUsersPromises: Promise<UpdateResult>[] = [];
                updateUsersPromises.push(
                  collection.updateOne(
                    {
                      uid,
                    },
                    {
                      $push: {
                        friends: friendUid,
                      },
                      $pull: {
                        receivedFriendRequests: friendUid,
                        sendedFriendRequests: friendUid,
                      },
                    }
                  )
                );
                updateUsersPromises.push(
                  collection.updateOne(
                    {
                      uid: friendUid,
                    },
                    {
                      $push: {
                        friends: uid,
                      },
                      $pull: {
                        receivedFriendRequests: uid,
                        sendedFriendRequests: uid,
                      },
                    }
                  )
                );
                return Promise.all(updateUsersPromises)
                  .then(([userResult, friendResult]) => {
                    if (
                      1 === userResult.modifiedCount &&
                      1 === friendResult.modifiedCount
                    ) {
                      return true;
                    }
                    return false;
                  })
                  .catch((err) => {
                    throw err;
                  });
              }
              return false;
            }
            throw new Error("User not found");
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * Remove the friendship between two users
   * @param uid the current user id
   * @param friendUid the friend id involved in the broken relationship
   * @returns True if the update was successful, false otherwise
   */
  removeUserFromFriendList(uid: string, friendUid: string): Promise<boolean> {
    return this.client
      .connect()
      .then(() => {
        const collection = this.client
          .db(this._DB_NAME)
          .collection(this._COLLECTION);
        const updatePromises: Promise<UpdateResult>[] = [];
        updatePromises.push(
          collection.updateOne(
            {
              uid,
            },
            {
              $pull: {
                friends: friendUid,
              },
            }
          )
        );
        updatePromises.push(
          collection.updateOne(
            {
              uid: friendUid,
            },
            {
              $pull: {
                friends: uid,
              },
            }
          )
        );

        return Promise.all(updatePromises)
          .then(([userResult, friendResult]) => {
            if (
              1 === userResult.modifiedCount &&
              1 === friendResult.modifiedCount
            ) {
              return true;
            }
            return false;
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  }
}
