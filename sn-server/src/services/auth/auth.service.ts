import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Crypt } from "../crypt";

class AuthService extends Crypt {
  checkIfAuthenticated(req: Request, res: Response, next: NextFunction) {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader) {
      const bearer = bearerHeader.split(" ");
      const token = bearer[1];

      /**
       * verifiedToken = {
       *  uid: string,
       *  email: string,
       *  rightsLevel: RightLevel,
       *  iat: number,
       *  exp: number
       * }
       */
      try {
        res.locals.verifiedToken = this.verifyToken(token);
        res.locals.originalToken = token;
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

  checkWebsocketAuth(token: string): string | false | JwtPayload {
    try {
      const verifiedToken = this.verifyToken(token);
      if (verifiedToken) {
        return verifiedToken;
      }
      return false;
    } catch (err) {
      return false;
    }
  }
}

export const authService = new AuthService();
