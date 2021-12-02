import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";

import { HttpService } from "./http.service";
import { LocalStorageService } from "./local-storage.service";

import { User } from "../interfaces/user";
import { RightsLevels } from "../interfaces/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isLoggedIn: boolean = false;
  private rightsLevel: RightsLevels = RightsLevels.NOT_CONNECTED;
  private redirectUrl: string = "/";

  constructor(
    private httpService: HttpService,
    private localStorage: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Getter of rights level for a user
   * @returns A number in a promise from RightsLevels enum
   */
  async getRightsLevel(): Promise<number> {
    return this.rightsLevel;
  }

  /**
   * Check if the user is logged in
   * @returns A promise with a boolean, true if logged, false if not
   */
  async isUserLoggedIn(): Promise<boolean> {
    return this.isLoggedIn;
  }

  setRightsLevel(level: RightsLevels): AuthService {
    this.rightsLevel = level;
    return this;
  }

  setConnection(isLoggedIn: boolean): AuthService {
    this.isLoggedIn = isLoggedIn;
    return this;
  }

  /**
   * If the user was redirect after a forbidden navigation
   * @returns the previous url
   */
  getRedirectUrl(): string {
    return this.redirectUrl;
  }

  /**
   * If the user goes in a forbidden navigation, set the current url
   * @param url the current url to save
   */
  setRedirectUrl(url: string): AuthService {
    this.redirectUrl = url;
    return this;
  }

  getSession(token: string): Observable<User | null> {
    //this.setRedirectUrl(window.location.pathname);
    return this.httpService.getSession(token).pipe(
      map((data) => {
        if (data.body && data.body.isConnected) {
          this.setConnection(data.body.isConnected).setRightsLevel(
            data.body.rightsLevel
          );
        }
        return data.body;
      })
    );
  }

  /**
   * Check the user's credentials
   * @param email the user's email
   * @param password the user's password
   * @returns An observable with a boolean, true if the user is logged, false, otherwise
   */
  signInUser(email: string, password: string): Observable<User | null> {
    return this.httpService.sendSignInRequest(email, password).pipe(
      map((data) => {
        if (data.body && data.body.isConnected) {
          this.setConnection(data.body.isConnected).setRightsLevel(
            data.body.rightsLevel
          );
          if (data.body.token) this.localStorage.setToken(data.body.token);
        }
        return data.body;
      })
    );
  }

  /**
   * Logout the user
   */
  logoutUser(): AuthService {
    this.isLoggedIn = false;
    this.localStorage.logout();
    return this;
  }
}
