import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom, Observable } from "rxjs";
import { environment } from "src/environments/environment";

import { RandomUser, User, UserCreation } from "../interfaces/user";
import { Post } from "../interfaces/post";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  private readonly _apiUrl = environment.serverUrl + "/";
  private readonly _userUrl = this._apiUrl + "user/";
  private readonly _postsUrl = this._apiUrl + "posts/";

  constructor(private httpClient: HttpClient) {}

  getSession(): Observable<User> {
    return this.httpClient.get<User>(this._userUrl + `reconnect`);
  }

  /**
   * Send the data for the login
   * @param email
   * @param password
   * @returns An observable with the http response containing the user's data
   */
  sendSignInRequest(email: string, password: string): Observable<User> {
    return this.httpClient.get<User>(
      this._userUrl + `sign-in?email=${email}&password=${password}`
    );
  }

  /**
   * Send the data when the user registers
   * @param user The data from the form
   * @returns An observable with the http response containing the user's data
   */
  sendSignUpRequest(user: UserCreation): Observable<User> {
    return this.httpClient.put<User>(this._userUrl + "sign-up", user);
  }

  sendForgotPasswordRequest(email: string): Observable<string> {
    return this.httpClient.get(
      this._userUrl + `forgot-password?email=${email}`,
      {
        responseType: "text",
      }
    );
  }

  resetLinkVerif(rid: string): Promise<string> {
    return firstValueFrom(
      this.httpClient.get(this._userUrl + `reset-password-req?rid=${rid}`, {
        responseType: "text",
      })
    );
  }

  sendNewPassword(password: string, rid: string): Observable<Object> {
    return this.httpClient.post(this._userUrl + "reset-password", {
      password,
      rid,
    });
  }

  /**
   * Retrieves all posts for a given wall
   * @param wallId the wall id to retrieve the posts
   * @returns An array of posts in an observable with the http response
   */
  getAllWallPosts(wallId: string): Observable<Post[]> {
    return this.httpClient.get<Post[]>(
      this._postsUrl + `all-wall-posts?wallId=${wallId}`
    );
  }

  /**
   * Send a new post to a specified wall
   * @param content the content of this new post
   * @param wallId the wall id to post this content
   * @param uid the user id who posted this content
   * @returns an observable with the http response containing the new post
   */
  sendProfileMessage(
    content: string,
    wallId: string,
    uid: string
  ): Observable<Post> {
    return this.httpClient.post<Post>(this._postsUrl + "add-post", {
      content,
      wallId,
      uid,
    });
  }

  /**
   * Send a comment for a specific post
   * @param content The content of the comment
   * @param pid the post id where the comment is added
   * @param uid the user id of the user who is commenting
   * @returns An observable with the http response containing the modified post.
   */
  sendComment(content: string, pid: string, uid: string): Observable<Post> {
    return this.httpClient.patch<Post>(this._postsUrl + "add-comment", {
      content,
      pid,
      uid,
    });
  }

  /**
   * Delete a specified field
   * @param pid
   * @returns An observable containing the response (OK or an error)
   */
  deletePost(pid: string): Observable<string> {
    return this.httpClient.delete(this._postsUrl + `delete-post?pid=${pid}`, {
      responseType: "text",
    });
  }

  /**
   * Fetch all users from the server
   * @returns All the users in a limited format
   */
  getAllUsers(): Observable<RandomUser[]> {
    return this.httpClient.get<RandomUser[]>(this._userUrl + "get-users");
  }

  /**
   * Fetch all friends fro this user
   * @returns All the friends in a limited format
   */
  getAllFriends(): Observable<RandomUser[]> {
    return this.httpClient.get<RandomUser[]>(this._userUrl + "get-friends");
  }

  /**
   * Send a friend request
   * @param friendUid the user id to send the friend request
   * @returns The current user
   */
  friendRequest(friendUid: string): Observable<User> {
    return this.httpClient.patch<User>(this._userUrl + "add-friend-request", {
      friendUid,
    });
  }

  /**
   * Accept a user invitation to become friend
   * @param friendUid the user id that is becoming friend
   * @returns The current user
   */
  acceptFriendRequest(friendUid: string): Observable<User> {
    return this.httpClient.patch<User>(this._userUrl + "accept-invitation", {
      friendUid,
    });
  }

  /**
   * Remove a user from its friend list
   * @param friendUid the user id that will be removed from the friend list
   * @returns The current user
   */
  removeFriend(friendUid: string): Observable<User> {
    return this.httpClient.patch<User>(this._userUrl + "remove-friend", {
      friendUid,
    });
  }

  /**
   * Get data about a user
   * @param uid the user id to retrieve
   * @returns The user's data
   */
  getUser(uid: string): Observable<RandomUser> {
    return this.httpClient.get<RandomUser>(
      this._userUrl + `get-user?uid=${uid}`
    );
  }
}
