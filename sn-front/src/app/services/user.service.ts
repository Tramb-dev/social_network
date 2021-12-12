import { Injectable } from "@angular/core";

import { HttpService } from "./http.service";

import { RightsLevels } from "../interfaces/auth";
import { RandomUser, User } from "../interfaces/user";
import { map, Observable } from "rxjs";

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

  constructor(private httpSvc: HttpService) {}

  getUser(): User {
    return this.user;
  }

  setUser(user: User): UserService {
    this.user = user;
    return this;
  }

  updateUser(user: User): UserService {
    this.user = user;
    return this;
  }

  displayUsers(): Observable<RandomUser[] | null> {
    return this.httpSvc.getAllUsers().pipe(
      map((response) => {
        if (response && response.body) {
          return response.body;
        }
        return null;
      })
    );
  }
}
