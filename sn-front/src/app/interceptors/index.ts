import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { HttpErrorsInterceptor } from "./http-errors.interceptor";
import { AuthInterceptor } from "./auth.interceptor";

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorsInterceptor, multi: true },
];
