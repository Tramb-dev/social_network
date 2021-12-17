import { NextFunction, Request, Response } from "express";
import { db } from "./db/index.db";
import { mailer } from "./emails/index";
import { crypt } from "./crypt";

import { RandomUser, User } from "../interfaces/user.interface";

class UserService {
  private sendUser(user: User) {
    return {
      uid: user.uid,
      email: user.email,
      token: crypt.signPayload(user.uid, user.email, user.rightsLevel),
      firstName: user.firstName,
      lastName: user.lastName,
      isConnected: user.isConnected,
      rightsLevel: user.rightsLevel,
    };
  }

  /**
   * Convert a user output to a random user output
   * @param users
   */
  private sendRandomUsers(users: User[]): RandomUser[] {
    return users.map((user) => {
      const randomUser: RandomUser = {
        uid: user.uid,
        firstName: user.firstName,
        lastName: user.lastName,
        isConnected: user.isConnected,
      };
      if (user.picture) {
        randomUser.picture = user.picture;
      }
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
    const token = req.query.token;
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
    db.user
      .getUsers()
      .then((users) => {
        if (users) {
          const randomUsers = this.sendRandomUsers(users);
          return res.json(randomUsers);
        }
        res.status(404);
        return next(new Error("No user found"));
      })
      .catch((err) => {
        res.status(500);
        return next(new Error(err));
      });
  }
}

export const userService = new UserService();
