import { NextFunction, Request, Response } from "express";
import { db } from "../db/user.db";
import { main } from "../emails/index";

class UserService {
  signIn(req: Request, res: Response, next: NextFunction) {
    const data = req.query;
    if (data.email && data.password) {
      db.signIn(data.email, data.password)
        .then((user) => {
          if (user) {
            return res.json(user);
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
      return db
        .register(
          data.firstName,
          data.lastName,
          data.email,
          data.password,
          data.dateOfBirth
        )
        .then((user) => {
          if (user) {
            return res.json(user);
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
      db.insertForgotLink(emailAddress)
        .then((result) => {
          if (result) {
            // Envoi d'un mail
            main().catch(console.error);
          }
          return res.sendStatus(200);
        })
        .catch((err) => next(new Error(err)));
    } else {
      return res.sendStatus(400);
    }
  }

  resetPasswordExists(req: Request, res: Response) {
    if (req.query.rid) {
      return res.send("ok");
    }
    return res.sendStatus(400);
  }

  resetPassword(req: Request, res: Response) {
    if (req.query.rid && req.query.password) {
      return res.send("ok");
    }
    return res.sendStatus(400);
  }
}

export const userService = new UserService();
