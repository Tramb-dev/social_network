import { NextFunction, Request, Response } from "express";
import { Crypt } from "../crypt";

class AuthService extends Crypt {
  checkIfAuthenticated(req: Request, res: Response, next: NextFunction) {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      const bearer = bearerHeader.split(" ");
      const token = bearer[1];

      try {
        res.locals.token = this.verifyToken(token);
      } catch (err) {
        res.statusMessage = "Invalid signature";
        return res.sendStatus(403);
      }
      return next();
    } else {
      res.statusMessage = "Invalid signature";
      return res.sendStatus(403);
    }
  }
}

export const authService = new AuthService();
