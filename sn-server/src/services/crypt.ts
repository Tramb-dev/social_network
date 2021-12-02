import * as bcrypt from "bcryptjs";
import { sign, verify, JwtPayload, SignOptions } from "jsonwebtoken";
import { secret } from "../config";

export class Crypt {
  constructor() {}

  protected cryptPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  protected comparePasswords(
    userPassword: string,
    dbPassword: string
  ): boolean {
    return bcrypt.compareSync(userPassword, dbPassword);
  }

  protected signPayload(uid: string, email: string, password: string): string {
    const options: SignOptions = {
      expiresIn: "24h",
    };
    return sign({ uid, email, password }, secret, options);
  }

  protected verifyToken(token: string): JwtPayload | string {
    return verify(token, secret);
  }
}
