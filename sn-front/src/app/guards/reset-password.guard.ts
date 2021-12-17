import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { concatMap, from, map, mergeMap, Observable, of } from "rxjs";

import { AuthService } from "../services/auth.service";
import { RegisterService } from "../services/register.service";
import { UserService } from "../services/user.service";

@Injectable({
  providedIn: "root",
})
export class ResetPasswordGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private register: RegisterService,
    private user: UserService
  ) {}

  canActivate(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<true | UrlTree> {
    return this.auth.isUserLoggedIn().pipe(
      mergeMap((isLoggedIn) => {
        if (isLoggedIn) {
          return of(this.router.parseUrl("/member/wallId/" + this.user.me.uid));
        } else {
          const rid = childRoute.paramMap.get("rid");
          if (rid) {
            return from(this.register.checkResetLink(rid)).pipe(
              map((isLinkCorrect) => {
                if (isLinkCorrect) {
                  return true;
                }
                return this.router.parseUrl("/sign-in");
              })
            );
          }
          return of(this.router.parseUrl(this.auth.getLoginUrl()));
        }
      })
    );
  }
}
