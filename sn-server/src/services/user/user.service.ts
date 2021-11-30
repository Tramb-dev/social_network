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
    const email = req.query.email;
    const password = req.query.password;
    if (typeof email === "string" && typeof password === "string") {
      db.user
        .signIn(email, password)
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
}

export const userService = new UserService();
