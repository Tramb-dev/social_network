import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router, UrlTree } from "@angular/router";

import { HttpService } from "./http.service";
import { AuthService } from "./auth.service";

import { User, UserCreation } from "../interfaces/user";

@Injectable({
  providedIn: "root",
})
export class RegisterService {
  constructor(
    private httpService: HttpService,
    private auth: AuthService,
    private router: Router
  ) {}

  createUser(user: UserCreation): Observable<User | null> {
    return this.httpService.sendSignUpRequest(user).pipe(
      map((data) => {
        if (data.body && data.body.isConnected) {
          this.auth.setConnection(data.body.isConnected);
          this.auth.setRightsLevel(data.body.rightsLevel);
        }
        return data.body;
      })
    );
  }

  sendResetEmail(emailAddress: string): Observable<boolean> {
    return this.httpService.sendForgotPasswordRequest(emailAddress).pipe(
      map((data) => {
        if (data && data === "OK") {
          return true;
        }
        return false;
      })
    );
  }

  checkResetLink(rid: string): Promise<true | UrlTree> {
    return this.httpService.resetLinkVerif(rid).then((data) => {
      if (data && data === "OK") {
        return true;
      }
      return this.router.parseUrl("/sign-in");
    });
  }

  async resetPassword(newPassword: string): Promise<boolean> {
    return true;
  }
}
