import { NextFunction, Request, Response } from "express";
import { Message } from "../interfaces/message.interface";
import { db } from "./db/index.db";

class DiscussionsService {
  getPrivateDiscussion(req: Request, res: Response, next: NextFunction) {
    const uid1 = req.query.uid1;
    const uid2 = req.query.uid2;
    const context = res.locals.verifiedToken;
    if (typeof uid1 === "string" && typeof uid2 === "string") {
      if (
        (context.uid === uid1 || context.uid === uid2) &&
        this.isUserAFriend(uid1, uid2)
      ) {
        return db.discussions
          .getPrivateDiscussionWithUsers(uid1, uid2)
          .then((discussion) => {
            if (discussion) {
              return res.json(discussion);
            }
            return res.sendStatus(404);
          })
          .catch((err) => {
            res.status(500);
            return next(err);
          });
      }
      return res.sendStatus(401);
    }
    return res.sendStatus(400);
  }

  getThisDiscussion(req: Request, res: Response, next: NextFunction) {
    const dId = req.query.dId;
    const context = res.locals.verifiedToken;
    if (typeof dId === "string") {
      return db.discussions
        .getDiscussionWithId(dId)
        .then((discussion) => {
          if (discussion) {
            if (discussion.users.includes(context.uid)) {
              return res.json(discussion);
            }
            return res.sendStatus(401);
          }
          return res.sendStatus(404);
        })
        .catch((err) => {
          res.status(500);
          return next(err);
        });
    }
    return res.sendStatus(400);
  }

  getAllDiscussions(req: Request, res: Response, next: NextFunction) {
    const uid = req.query.uid;
    const context = res.locals.verifiedToken;
    if (typeof uid === "string") {
      if (uid === context.uid) {
        return db.discussions
          .getAllDiscussions(uid)
          .then((discussions) => {
            if (discussions) {
              return res.json(discussions);
            }
            return res.sendStatus(404);
          })
          .catch((err) => {
            res.status(500);
            return next(err);
          });
      }
      return res.sendStatus(401);
    }
    return res.sendStatus(400);
  }

  getAllRooms(uid: string): Promise<string[]> {
    return db.discussions.getAllRooms(uid);
  }

  addNewMessage(dId: string, uid: string, content: string): Promise<Message> {
    return db.addNewMessage(dId, uid, content);
  }

  deleteMessage(mid: string): Promise<boolean> {
    return db.discussions.deleteMessage(mid);
  }

  /**
   * Check if the users are friends
   * @param uid1 the first user id
   * @param uid2 the second user id
   * @returns true if they are friends, false otherwise
   */
  private isUserAFriend(uid1: string, uid2: string): Promise<boolean> {
    return db.user.getUser(uid1).then((user) => {
      if (user?.friends?.includes(uid2)) {
        return true;
      }
      return false;
    });
  }
}

export const discussionsService = new DiscussionsService();
