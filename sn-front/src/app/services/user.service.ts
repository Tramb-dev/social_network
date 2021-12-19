import { Injectable } from "@angular/core";

import { HttpService } from "./http.service";

import { RightsLevels } from "../interfaces/auth";
import { RandomUser, User } from "../interfaces/user";
import { Observable, tap } from "rxjs";

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

  get me(): User {
    return this.user;
  }

  set me(user: User) {
    this.user = user;
  }

  /**
   * Display all users to add them as friends
   * @returns an array of users in an observable
   */
  displayUsers(): Observable<RandomUser[] | null> {
    return this.httpSvc.getAllUsers();
  }

  /**
   * Send a friend request for this friend
   * @param friendUid friend user id
   * @returns
   */
  sendFriendRequest(friendUid: string): Observable<User> {
    return this.httpSvc
      .friendRequest(friendUid)
      .pipe(tap((user) => (this.me = user)));
  }
}
