import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isAuth = true;

  constructor() {}

  getAuth(): boolean {
    return this.isAuth;
  }
}
