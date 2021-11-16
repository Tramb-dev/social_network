import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "src/environments/environment";

import { User, UserCreation } from "../interfaces/user";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  private readonly _apiUrl = environment.serverUrl + "/";
  private readonly _userUrl = this._apiUrl + "user/";
  // TODO: dev an auth connexion with server based on other security than username and password
  // Second argument in get, third in post
  httpOptions = {
    headers: new HttpHeaders({
      Authorization: btoa("username:password"),
    }),
  };

  constructor(private httpClient: HttpClient) {}

  sendSignInRequest(
    email: string,
    password: string
  ): Observable<HttpResponse<User>> {
    const options = {
      observe: "response" as const,
    };
    return this.httpClient
      .get<User>(
        this._userUrl + `sign-in?email=${email}&password=${password}`,
        options
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  sendSignUpRequest(user: UserCreation): Observable<HttpResponse<User>> {
    const options = {
      observe: "response" as const,
    };
    return this.httpClient
      .post<User>(this._userUrl + "sign-up", user, options)
      .pipe(retry(3), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (0 === error.status) {
      console.error(`An error occured: ${error.error}`);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: ${error.statusText}`
      );
    }
    return throwError(error);
  }
}
