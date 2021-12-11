import { NextFunction, Request, Response } from "express";
import { Crypt } from "../crypt";

class AuthService extends Crypt {
  checkIfAuthenticated(req: Request, res: Response, next: NextFunction) {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      const bearer = bearerHeader.split(" ");
      const token = bearer[1];

      res.locals.token = this.verifyToken(token);
      return next();
    } else {
      return res.sendStatus(403);
    }
  }
}

export const authService = new AuthService();
