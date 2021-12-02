import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  constructor() {}

  setToken(token: string): LocalStorageService {
    localStorage.setItem("userSession", token);
    return this;
  }

  retrieveToken(): string | null {
    return localStorage.getItem("userSession");
  }

  logout(): LocalStorageService {
    localStorage.clear();
    return this;
  }
}
