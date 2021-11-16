import * as bcrypt from "bcryptjs";

class Crypt {
  cryptPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  comparePasswords(userPassword: string, dbPassword: string): Promise<boolean> {
    return bcrypt.compare(userPassword, dbPassword);
  }
}

export const crypt = new Crypt();
