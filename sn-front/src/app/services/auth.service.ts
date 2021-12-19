import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";

import { HttpService } from "./http.service";
import { LocalStorageService } from "./local-storage.service";
import { UserService } from "./user.service";
import { SnackBarService } from "./snack-bar.service";

import { User } from "../interfaces/user";
import { RightsLevels } from "../interfaces/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isLoggedIn = false;
  private rightsLevel = RightsLevels.NOT_CONNECTED;
  private redirectUrl = "/";
  private loginUrl = "/sign-in";
  private tokenExpirationDate: number = 0;
  private readonly _tokenMaxTime = 86400; // 24h

  constructor(
    private httpService: HttpService,
    private localStorage: LocalStorageService,
    private user: UserService,
    private snackBar: SnackBarService
  ) {}

  /**
   * Getter of rights level for a user
   * @returns A number in a promise from RightsLevels enum
   */
  getRightsLevel(): RightsLevels {
    return this.rightsLevel;
  }

  /**
   * Check if the user is logged in, if not reconnect if possible
   * @returns An observable boolean, true if logged, false if not
   */
  isUserLoggedIn(): Observable<boolean> {
    if (this.isLoggedIn) {
      return of(this.isLoggedIn);
    } else {
      return this.getSession().pipe(
        map((user) => {
          if (user) {
            this.user.me = user;
            return true;
          }
          return false;
        })
      );
    }
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

  getLoginUrl(): string {
    return this.loginUrl;
  }

  getSession(): Observable<User | false> {
    //this.setRedirectUrl(this.route.snapshot.url);
    const token = this.localStorage.retrieveToken();
    if (
      token &&
      (this.tokenExpirationDate > Date.now() / 1000 ||
        this.tokenExpirationDate === 0)
    ) {
      return this.httpService.getSession().pipe(
        tap((data) => {
          this.setSignedUserInSession(data);
        })
      );
    }
    return of(false);
  }

  /**
   * Check the user's credentials
   * @param email the user's email
   * @param password the user's password
   * @returns An observable with a boolean, true if the user is logged, false, otherwise
   */
  signInUser(email: string, password: string): Observable<User | null> {
    return this.httpService.sendSignInRequest(email, password).pipe(
      tap((data) => {
        this.setSignedUserInSession(data);
      })
    );
  }

  private setSignedUserInSession(data: User): AuthService {
    if (data && data.isConnected) {
      this.setConnection(data.isConnected).setRightsLevel(data.rightsLevel);
      if (data.token) {
        this.localStorage.setToken(data.token);
        this.tokenExpirationDate = Date.now() / 1000 + this._tokenMaxTime;
      }
    }
    return this;
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
