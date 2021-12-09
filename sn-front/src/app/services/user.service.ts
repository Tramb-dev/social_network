import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "./auth.service";
import { SnackBarService } from "./snack-bar.service";

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

  constructor(
    private auth: AuthService,
    private snack: SnackBarService,
    private router: Router
  ) {}

  getUser(): User {
    return this.user;
  }

  updateUser(user: User): UserService {
    this.user = user;
    return this;
  }

  reconnect(token: string): void {
    const sub = this.auth.getSession(token).subscribe((user) => {
      if (user && typeof user === "object") {
        this.updateUser(user);
        this.router.navigate(["/member/wall", user.uid]);
      } else {
        this.snack.presentSnackBar(
          "Le temps de session est dépassé, veuillez vous reconnecter.",
          "snackBar-top",
          3000
        );
        this.router.navigate(["/sign-in"]);
      }
      sub.unsubscribe();
    });
  }
}
