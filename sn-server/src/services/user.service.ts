import { NextFunction, Request, Response } from "express";
import { db } from "./db/index.db";
import { mailer } from "./emails/index";
import { crypt } from "./crypt";

import { RandomUser, User, VerifiedToken } from "../interfaces/user.interface";

class UserService {
  /**
   * Send only necessary data about a user
   * @param user
   * @returns
   */
  private sendUser(user: User | null) {
    if (user) {
      return {
        uid: user.uid,
        email: user.email,
        token: crypt.signPayload(user.uid, user.email, user.rightsLevel),
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        isConnected: user.isConnected,
        rightsLevel: user.rightsLevel,
        sendedFriendRequests: user.sendedFriendRequests,
        receivedFriendRequests: user.receivedFriendRequests,
        friends: user.friends,
      };
    }
    return null;
  }

  /**
   * Convert a user output to a random user output
   * @param users
   */
  private sendRandomUsers(users: User[], uid: string): RandomUser[] {
    return users.map((user) => {
      let alreadyFriend = user.friends?.includes(uid);
      if (typeof alreadyFriend === "undefined") {
        alreadyFriend = false;
      }
      const randomUser: RandomUser = {
        uid: user.uid,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        isConnected: user.isConnected,
        alreadyFriend,
      };
      return randomUser;
    });
  }

  signIn(req: Request, res: Response, next: NextFunction) {
    const email = req.query.email;
    const password = req.query.password;
    if (typeof email === "string" && typeof password === "string") {
      db.user
        .signIn({ email, password })
        .then((user) => {
          if (user) {
            return res.json(this.sendUser(user));
          } else {
            res.status(404);
            res.statusMessage = "Incorrect credentials";
            return next(new Error("Incorrect credentials"));
          }
        })
        .catch((err) => {
          res.status(400);
          return next(new Error(err));
        });
    } else {
      return res.sendStatus(400);
    }
  }

  autoConnect(req: Request, res: Response, next: NextFunction) {
    const token = res.locals.originalToken;
    if (typeof token === "string") {
      const verifyedToken = crypt.verifyToken(token);
      if (typeof verifyedToken === "object" && verifyedToken) {
        db.user
          .signIn({
            email: verifyedToken.email,
            uid: verifyedToken.uid,
          })
          .then((user) => {
            if (user) {
              return res.json(this.sendUser(user));
            } else {
              res.statusMessage = "Invalid token";
              return res.sendStatus(401);
            }
          });
      } else {
        res.statusMessage = "Token expired";
        return res.sendStatus(401);
      }
    } else {
      return res.sendStatus(400);
    }
  }

  signUp(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    if (
      data.firstName &&
      data.lastName &&
      data.email &&
      data.password &&
      data.dateOfBirth
    ) {
      return db.user
        .register(
          data.firstName,
          data.lastName,
          data.email,
          data.password,
          data.dateOfBirth
        )
        .then((user) => {
          if (user) {
            res.status(201);
            return res.json(this.sendUser(user));
          } else {
            res.status(409);
            return next(new Error("Email already exists"));
          }
        })
        .catch((err) => {
          res.status(400);
          return next(new Error(err));
        });
    }
    return res.sendStatus(400);
  }

  forgotPassword(req: Request, res: Response, next: NextFunction) {
    const emailAddress = req.query.email;
    if (typeof emailAddress === "string") {
      db.user
        .insertForgotLink(emailAddress)
        .then((result) => {
          if (result) {
            mailer.sendResetLink(emailAddress, result);
          }
          return res.sendStatus(200);
        })
        .catch((err) => {
          res.status(400);
          next(new Error(err));
        });
    } else {
      return res.sendStatus(400);
    }
  }

  resetPasswordExists(req: Request, res: Response, next: NextFunction) {
    const rid = req.query.rid;
    if (typeof rid === "string") {
      db.user
        .checkResetPasswordLink(rid)
        .then((ridExists) => {
          if (ridExists) {
            return res.sendStatus(200);
          }
        })
        .catch((err) => {
          res.status(400);
          next(new Error(err));
        });
    } else {
      return res.sendStatus(400);
    }
  }

  resetPassword(req: Request, res: Response, next: NextFunction) {
    const rid = req.body.rid;
    const password = req.body.password;
    if (typeof rid === "string" && typeof password === "string") {
      db.user
        .changePassword(password, rid)
        .then((isPasswordChanged) => {
          if (isPasswordChanged) {
            return res.sendStatus(204);
          }
          res.status(400);
          return next(new Error("Error in provided information"));
        })
        .catch((err) => {
          res.status(400);
          next(new Error(err));
        });
    } else {
      return res.sendStatus(400);
    }
  }

  getAllUsers(req: Request, res: Response, next: NextFunction) {
    const context = res.locals.verifiedToken;
    db.user
      .getUsers()
      .then((users) => {
        if (users) {
          const modifiedUsers = users.filter(
            (user) => user.uid !== context.uid
          );
          if (modifiedUsers.length > 0) {
            const randomUsers = this.sendRandomUsers(
              modifiedUsers,
              context.uid
            );
            return res.json(randomUsers);
          }
        }
        res.status(404);
        return next(new Error("User not found"));
      })
      .catch((err) => {
        res.status(500);
        return next(new Error(err));
      });
  }

  getAllFriends(req: Request, res: Response, next: NextFunction) {
    const context = res.locals.verifiedToken;
    db.user
      .getFriends(context.uid)
      .then((users) => {
        if (users) {
          const modifiedUsers = users.filter(
            (user) => user.uid !== context.uid
          );
          if (modifiedUsers.length > 0) {
            const randomUsers = this.sendRandomUsers(
              modifiedUsers,
              context.uid
            );
            return res.json(randomUsers);
          }
        }
        res.status(404);
        return next(new Error("User not found"));
      })
      .catch((err) => {
        res.status(500);
        return next(new Error(err));
      });
  }

  addFriendRequest(req: Request, res: Response, next: NextFunction) {
    const context: VerifiedToken = res.locals.verifiedToken;
    const friendUid: string = req.body.friendUid;
    if (typeof friendUid === "string" && context.uid) {
      return db.user
        .addFriendRequest(context.uid, req.body.friendUid)
        .then((isAdded) => {
          if (isAdded) {
            res.status(200);
            return db.user
              .getUser(context.uid)
              .then((user) => res.json(this.sendUser(user)))
              .catch((err) => {
                res.status(404);
                return next(err);
              });
          } else {
            res.status(202);
            return db.user
              .getUser(context.uid)
              .then((user) => res.json(this.sendUser(user)))
              .catch((err) => {
                res.status(404);
                return next(err);
              });
          }
        })
        .catch((err) => {
          res.status(500);
          return next(err);
        });
    }
    return res.sendStatus(400);
  }

  acceptFriendRequest(req: Request, res: Response, next: NextFunction) {
    const context: VerifiedToken = res.locals.verifiedToken;
    const friendUid: string = req.body.friendUid;
    if (typeof friendUid === "string" && context.uid) {
      return db.user
        .convertInvitationToFriendship(context.uid, req.body.friendUid)
        .then((isAdded) => {
          if (isAdded) {
            res.status(200);
            return db.user
              .getUser(context.uid)
              .then((user) => res.json(this.sendUser(user)))
              .catch((err) => {
                res.status(404);
                return next(err);
              });
          } else {
            res.status(202);
            return db.user
              .getUser(context.uid)
              .then((user) => res.json(this.sendUser(user)))
              .catch((err) => {
                res.status(404);
                return next(err);
              });
          }
        })
        .catch((err) => {
          res.status(500);
          return next(err);
        });
    }
    return res.sendStatus(400);
  }
}

export const userService = new UserService();
