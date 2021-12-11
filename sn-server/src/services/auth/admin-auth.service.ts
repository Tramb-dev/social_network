import { NextFunction, Request, Response } from "express";
import { RightsLevels } from "../../interfaces/user.interface";

class AdminAuthService {
  checkIfAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (
      res.locals.token &&
      res.locals.token.rightsLevel === RightsLevels.ADMIN
    ) {
      return next();
    } else {
      return res.sendStatus(403);
    }
  }
}

export const adminAuthService = new AdminAuthService();
