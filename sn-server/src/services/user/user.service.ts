import { NextFunction, Request, Response } from "express";
import { db } from "../db/index.db";
import { mailer } from "../emails/index";
import { User } from "../../interfaces/user.interface";

class UserService {
  sendUser(user: User) {
    return {
      uid: user.uid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isConnected: user.isConnected,
      rightsLevel: user.rightsLevel,
    };
  }

  signIn(req: Request, res: Response, next: NextFunction) {
    const data = req.query;
    if (data.email && data.password) {
      db.user
        .signIn(data.email, data.password)
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
          return next(new Error(err));
        });
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
            return res.json(this.sendUser(user));
          } else {
            res.status(409);
            return next(new Error("Email already exists"));
          }
        })
        .catch((err) => {
          return next(new Error(err));
        });
    }
    return res.sendStatus(400);
  }

  forgotPassword(req: Request, res: Response, next: NextFunction) {
    const emailAddress = req.query.email;
    if (emailAddress && typeof emailAddress === "string") {
      db.user
        .insertForgotLink(emailAddress)
        .then((result) => {
          if (result) {
            mailer.sendResetLink(emailAddress, result);
          }
          return res.sendStatus(200);
        })
        .catch((err) => next(new Error(err)));
    } else {
      return res.sendStatus(400);
    }
  }

  resetPasswordExists(req: Request, res: Response, next: NextFunction) {
    const rid = req.query.rid;
    if (rid && typeof rid === "string") {
      db.user
        .checkResetPasswordLink(rid)
        .then((ridExists) => {
          if (ridExists) {
            return res.sendStatus(200);
          }
        })
        .catch((err) => next(new Error(err)));
    } else {
      return res.sendStatus(400);
    }
  }

  resetPassword(req: Request, res: Response) {
    if (req.query.rid && req.query.password) {
      return res.send("ok");
    }
    return res.sendStatus(400);
  }
}

export const userService = new UserService();
