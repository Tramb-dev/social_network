import { Injectable } from "@angular/core";

import { RightsLevels } from "../interfaces/auth";
import { User } from "../interfaces/user";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private user: User = {
    uid: "",
    email: "",
    firstName: "",
    lastName: "",
    isConnected: false,
    rightsLevel: RightsLevels.NOT_CONNECTED,
  };

  constructor() {}

  getUser(): User {
    return this.user;
  }

  updateUser(user: User): void {
    this.user = user;
    console.log(user);
  }
}
