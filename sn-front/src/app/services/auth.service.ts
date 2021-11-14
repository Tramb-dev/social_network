import { Injectable } from "@angular/core";

import { RightsLevels } from "../interfaces/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isLoggedIn: boolean = false;
  private rightsLevel: RightsLevels = RightsLevels.MEMBER;
  private redirectUrl: string = "/";

  constructor() {}

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
  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  // TODO: implémenter le système de login
  /**
   * Check the user's credentials
   * @param email the user's email
   * @param password the user's password
   * @returns A promise with a boolean, true if the user is logged, false, otherwise
   */
  async signInUser(email: string, password: string): Promise<boolean> {
    return false;
  }

  /**
   * Logout the user
   */
  logoutUser(): void {
    this.isLoggedIn = false;
  }
}
