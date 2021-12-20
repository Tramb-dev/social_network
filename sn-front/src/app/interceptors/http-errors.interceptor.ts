import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError, Observable, of, retry, throwError } from "rxjs";
import { Router } from "@angular/router";

import { AuthService } from "../services/auth.service";
import { RouteMessageService } from "../services/route-message.service";

/** Pass untouched request through to the next request handler. */
@Injectable()
export class HttpErrorsInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private router: Router,
    private routeMsg: RouteMessageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let handled: boolean = false;

    return next.handle(req).pipe(
      retry(2),
      catchError((returnedError) => {
        let errorMessage: string | null = null;

        if (returnedError.error instanceof ErrorEvent) {
          errorMessage = `Error: ${returnedError.message}`;
        } else if (returnedError instanceof HttpErrorResponse) {
          errorMessage = `Error Status ${returnedError.status}: ${returnedError.statusText}`;
          handled = this.handleServerSideError(returnedError);
        }

        console.error(errorMessage ? errorMessage : returnedError);

        if (!handled) {
          if (errorMessage) {
            const errorMsg = errorMessage;
            return throwError(() => new Error(errorMsg));
          } else {
            return throwError(() => new Error("Unexpected problem occured"));
          }
        } else {
          return of(returnedError);
        }
      })
    );
  }

  private handleServerSideError(error: HttpErrorResponse): boolean {
    let handled: boolean = false;

    switch (error.status) {
      case 401:
        this.routeMsg.message =
          "Votre session a expiré. Veuillez vous reconnecter";
        this.auth.logoutUser();
        handled = true;
        this.router.navigateByUrl(this.auth.getLoginUrl());
        break;

      case 403:
        this.routeMsg.message =
          "Vous n'avez pas l'autorisation pour cette action.";
        handled = true;
        break;
    }

    return handled;
  }
}
