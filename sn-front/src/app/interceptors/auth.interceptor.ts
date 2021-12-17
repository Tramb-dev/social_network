import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { LocalStorageService } from "../services/local-storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storage: LocalStorageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.storage.retrieveToken();

    if (token) {
      req = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + token),
      });
    }
    return next.handle(req);
  }
}
