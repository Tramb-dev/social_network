import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { Discussion } from "../../interfaces/discussion.interface";
import { Message } from "../../interfaces/message.interface";

export class DiscussionsDB {
  private client: MongoClient;
  private _DB_NAME: string;
  private readonly _COLLECTION = "discussions";

  constructor(client: MongoClient, dbName: string) {
    this.client = client;
    this._DB_NAME = dbName;
  }

  /**
   * Get a private discussion between two users with their user ids
   * @param uid1 The first user id
   * @param uid2 The second user id
   * @returns The discussion
   */
  getPrivateDiscussionWithUsers(
    uid1: string,
    uid2: string
  ): Promise<Discussion> {
    return this.client
      .connect()
      .then(() => {
        return this.client
          .db(this._DB_NAME)
          .collection(this._COLLECTION)
          .findOne<Discussion>({
            users: {
              $all: [uid1, uid2],
            },
            privateDiscussion: true,
          })
          .then((discussion) => {
            if (discussion) {
              return discussion;
            } else {
              return this.createNewDiscussion([uid1, uid2], true);
            }
          })
          .catch((err) => {
            throw new Error("Error in getting a private discussion: " + err);
          });
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * Get a discussion
   * @param dId The discussion id
   * @returns The discussion
   */
  getDiscussionWithId(dId: string): Promise<Discussion | null> {
    return this.client
      .connect()
      .then(() => {
        return this.client
          .db(this._DB_NAME)
          .collection(this._COLLECTION)
          .findOne<Discussion>({
            dId,
          })
          .catch((err) => {
            throw new Error("Error in getting a private discussion: " + err);
          });
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * Get all the discussion for a user, sorted by the last in first
   * @param uid The user id
   * @returns An array of discussions
   */
  getAllDiscussions(uid: string): Promise<Discussion[]> {
    return this.client
      .connect()
      .then(() => {
        return this.client
          .db(this._DB_NAME)
          .collection(this._COLLECTION)
          .find({
            users: uid,
          })
          .sort({
            "message.date": -1,
          })
          .project<Discussion>({ _id: 0 })
          .toArray()
          .catch((err) => {
            throw new Error("Error getting all discussions: " + err);
          });
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * Create a new discussion
   * @param users An array of users involved in the discussion
   * @param privateDiscussion True if it is a private discussion (between two members)
   * or false for more than 2 members
   * @param owner Optional, set for a group discussion
   * @returns The discussion
   */
  private createNewDiscussion(
    users: string[],
    privateDiscussion: boolean,
    owner?: string
  ): Promise<Discussion> {
    if (users.length > 1) {
      return this.client.connect().then(() => {
        const newDiscussion: Discussion = {
          dId: uuidv4(),
          users: users,
          messages: [],
          privateDiscussion,
        };
        if (owner) {
          newDiscussion.owner = owner;
        }

        return this.client
          .db(this._DB_NAME)
          .collection(this._COLLECTION)
          .insertOne(newDiscussion)
          .then((result) => {
            if (result.acknowledged) {
              return this.getDiscussionWithId(newDiscussion.dId)
                .then((discussion) => {
                  if (discussion) {
                    return discussion;
                  } else {
                    throw new Error("The discussion was not created before");
                  }
                })
                .catch((err) => {
                  throw err;
                });
            } else {
              throw new Error("Unable to create a new discussion");
            }
          })
          .catch((err) => {
            throw err;
          });
      });
    } else {
      throw new Error("Need at least 2 person to create a discussion");
    }
  }

  /**
   * Add a user to a discussion
   * @param dId The discussion id
   * @param uid The user id to add
   * @returns The discussion
   */
  addUserToDiscussion(dId: string, uid: string): Promise<Discussion> {
    return this.updateUsersInDiscussion(dId, uid, "add");
  }

  /**
   * Removes a user from a discussion
   * @param dId The discussion id
   * @param uid The user id to remove
   * @returns The discussion
   */
  removeUserFromDiscussion(dId: string, uid: string): Promise<Discussion> {
    return this.updateUsersInDiscussion(dId, uid, "remove");
  }

  /**
   * Update a discussion with an operation on the users array
   * @param dId The discussion id
   * @param uid The user id concerned by the operation
   * @param operation The operation to execute on the user field of this discussion
   * "add" for adding a user, "remove" for removing the user
   * @returns The discussion
   */
  private updateUsersInDiscussion(
    dId: string,
    uid: string,
    operation: "add" | "remove"
  ): Promise<Discussion> {
    const collection = this.client
      .db(this._DB_NAME)
      .collection(this._COLLECTION);
    let toUpdate: Record<string, unknown>;
    const users = { users: uid };
    switch (operation) {
      case "add":
        toUpdate = {
          $push: users,
        };
        break;

      case "remove":
        toUpdate = {
          $pull: users,
        };
    }
    return collection
      .updateOne(
        {
          dId,
        },
        toUpdate
      )
      .then((result) => {
        if (result.modifiedCount === 1) {
          return this.getDiscussionWithId(dId)
            .then((discussion) => {
              if (discussion) {
                return discussion;
              } else {
                throw new Error("The discussion was not created before");
              }
            })
            .catch((err) => {
              throw err;
            });
        } else {
          throw new Error("Unable to update the discussion");
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  /**
   * Add a new message to a discussion
   * @param dId The discussion id
   * @param uid The user id who wrote the message
   * @param content The message content
   * @returns The added message
   */
  addNewMessage(dId: string, uid: string, content: string): Promise<Message> {
    const collection = this.client
      .db(this._DB_NAME)
      .collection(this._COLLECTION);
    const currentDate = new Date();
    const newMessage: Message = {
      uid,
      mid: uuidv4(),
      content,
      date: currentDate,
    };
    return collection
      .updateOne(
        {
          dId,
        },
        {
          $push: {
            messages: newMessage,
          },
        }
      )
      .then((result) => {
        if (result.modifiedCount === 1) {
          return newMessage;
        } else {
          throw new Error("Unable to update the discussion");
        }
      })
      .catch((err) => {
        throw err;
      });
  }
}
