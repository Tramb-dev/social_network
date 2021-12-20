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
    picture: "assets/images/default-user.jpg",
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

  getUser(uid: string): Observable<RandomUser> {
    return this.httpSvc.getUser(uid);
  }

  /**
   * Display all users to add them as friends
   * @returns an array of users in an observable
   */
  displayUsers(): Observable<RandomUser[]> {
    return this.httpSvc.getAllUsers();
  }

  /**
   * Display all friends for this user
   * @returns an array of friends in a observable
   */
  displayFriends(): Observable<RandomUser[]> {
    return this.httpSvc.getAllFriends();
  }

  /**
   * Send a friend request for this friend
   * @param friendUid friend user id
   * @returns The current user
   */
  sendFriendRequest(friendUid: string): Observable<User> {
    return this.httpSvc
      .friendRequest(friendUid)
      .pipe(tap((user) => (this.me = user)));
  }

  /**
   * Validate the invitaiton to become friends
   * @param friendUid friend user id
   * @returns The current user
   */
  acceptFriendRequest(friendUid: string): Observable<User> {
    return this.httpSvc
      .acceptFriendRequest(friendUid)
      .pipe(tap((user) => (this.me = user)));
  }

  removeFriend(friendUid: string): Observable<User> {
    return this.httpSvc
      .removeFriend(friendUid)
      .pipe(tap((user) => (this.me = user)));
  }
}
