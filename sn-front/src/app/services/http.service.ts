import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from "@angular/common/http";
import { firstValueFrom, Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "src/environments/environment";

import { User, UserCreation } from "../interfaces/user";
import { Post } from "../interfaces/post";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  private readonly _apiUrl = environment.serverUrl + "/";
  private readonly _userUrl = this._apiUrl + "user/";
  private readonly _postsUrl = this._apiUrl + "posts/";
  private options = {
    observe: "response" as const,
  };

  constructor(private httpClient: HttpClient) {}

  getSession(token: string): Observable<HttpResponse<User>> {
    return this.httpClient
      .get<User>(this._userUrl + `reconnect?token=${token}`, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Send the data for the login
   * @param email
   * @param password
   * @returns An observable with the http response containing the user's data
   */
  sendSignInRequest(
    email: string,
    password: string
  ): Observable<HttpResponse<User>> {
    return this.httpClient
      .get<User>(
        this._userUrl + `sign-in?email=${email}&password=${password}`,
        this.options
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Send the data when the user registers
   * @param user The data from the form
   * @returns An observable with the http response containing the user's data
   */
  sendSignUpRequest(user: UserCreation): Observable<HttpResponse<User>> {
    return this.httpClient
      .put<User>(this._userUrl + "sign-up", user, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }

  sendForgotPasswordRequest(email: string): Observable<string> {
    return this.httpClient
      .get(this._userUrl + `forgot-password?email=${email}`, {
        responseType: "text",
      })
      .pipe(retry(3), catchError(this.handleError));
  }

  resetLinkVerif(rid: string): Promise<string> {
    return firstValueFrom(
      this.httpClient
        .get(this._userUrl + `reset-password-req?rid=${rid}`, {
          responseType: "text",
        })
        .pipe(retry(3), catchError(this.handleError))
    );
  }

  sendNewPassword(
    password: string,
    rid: string
  ): Observable<HttpResponse<Object>> {
    return this.httpClient
      .post(
        this._userUrl + "reset-password",
        {
          password,
          rid,
        },
        this.options
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  getAllWallPosts(wallId: string): Observable<HttpResponse<Post[]>> {
    return this.httpClient
      .get<Post[]>(
        this._postsUrl + `all-wall-posts?wallId=${wallId}`,
        this.options
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  sendProfileMessage(
    content: string,
    wallId: string,
    uid: string
  ): Observable<HttpResponse<Post>> {
    return this.httpClient
      .put<Post>(
        this._postsUrl + "add-post",
        { content, wallId, uid },
        this.options
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  sendComment(
    content: string,
    pid: string,
    uid: string
  ): Observable<HttpResponse<Post>> {
    return this.httpClient
      .put<Post>(
        this._postsUrl + "add-comment",
        { content, pid, uid },
        this.options
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  deletePost(pid: string): Observable<string> {
    return this.httpClient
      .delete(this._postsUrl + `delete-post?pid=${pid}`, {
        responseType: "text",
      })
      .pipe(retry(3), catchError(this.handleError));
  }

  /**
   * Handles error from http response
   * @param error
   * @returns An observable completed with the error
   */
  private handleError(error: HttpErrorResponse) {
    if (0 === error.status) {
      return throwError(() => new Error(`An error occured: ${error.error}`));
    } else {
      return throwError(
        () =>
          new Error(
            `Backend returned code ${error.status}, body was: ${error.statusText}`
          )
      );
    }
  }
}
