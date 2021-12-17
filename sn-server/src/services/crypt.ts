import * as bcrypt from "bcryptjs";
import { sign, verify, JwtPayload, SignOptions } from "jsonwebtoken";

import { secret } from "../config";
import { RightsLevels } from "../interfaces/user.interface";

export class Crypt {
  constructor() {}

  cryptPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  comparePasswords(userPassword: string, dbPassword: string): boolean {
    return bcrypt.compareSync(userPassword, dbPassword);
  }

  signPayload(uid: string, email: string, rightsLevel: RightsLevels): string {
    const options: SignOptions = {
      expiresIn: "24h",
    };
    return sign({ uid, email, rightsLevel }, secret, options);
  }

  verifyToken(token: string): JwtPayload | string | null {
    try {
      return verify(token, secret);
    } catch (err) {
      return null;
    }
  }
}

export const crypt = new Crypt();
