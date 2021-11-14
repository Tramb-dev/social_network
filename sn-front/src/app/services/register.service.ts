import { Injectable } from "@angular/core";

import { User } from "../interfaces/user";

@Injectable({
  providedIn: "root",
})
export class RegisterService {
  constructor() {}

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    dateOfBirth: Date
  ): Promise<User> {
    const user: User = {};
    return user;
  }

  async sendResetEmail(emailAddress: string): Promise<boolean> {
    return true;
  }
}
