import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Router, UrlTree } from "@angular/router";

import { HttpService } from "./http.service";
import { AuthService } from "./auth.service";

import { User, UserCreation } from "../interfaces/user";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
  providedIn: "root",
})
export class RegisterService {
  constructor(
    private httpService: HttpService,
    private auth: AuthService,
    private localStorage: LocalStorageService,
    private router: Router
  ) {}

  createUser(user: UserCreation): Observable<User | null> {
    return this.httpService.sendSignUpRequest(user).pipe(
      map((data) => {
        if (data && data.isConnected) {
          this.auth
            .setConnection(data.isConnected)
            .setRightsLevel(data.rightsLevel);
          if (data.token) {
            this.localStorage.setToken(data.token);
            this.router.navigate(["/member/wall", data.uid]);
          }
        }
        return data;
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

  checkResetLink(rid: string): Promise<boolean> {
    return this.httpService.resetLinkVerif(rid).then((data) => {
      if (data && data === "OK") {
        return true;
      }
      return false;
    });
  }

  resetPassword(
    newPassword: string,
    rid: string
  ): Observable<false | Promise<boolean>> {
    return this.httpService.sendNewPassword(newPassword, rid).pipe(
      map((data) => {
        if (data) {
          return this.router.navigate(["/", "sign-in"]);
        }
        return false;
      })
    );
  }
}
