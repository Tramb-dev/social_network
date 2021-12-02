import { Injectable } from "@angular/core";

import { AuthService } from "./auth.service";

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

  constructor(private auth: AuthService) {}

  getUser(): User {
    return this.user;
  }

  updateUser(user: User): UserService {
    this.user = user;
    return this;
  }

  reconnect(token: string): void {
    const sub = this.auth.getSession(token).subscribe((user) => {
      if (user) {
        this.updateUser(user);
      }
      sub.unsubscribe();
    });
  }
}
