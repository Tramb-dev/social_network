import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";

import { AuthService } from "../services/auth.service";
import { RegisterService } from "../services/register.service";

@Injectable({
  providedIn: "root",
})
export class ResetPasswordGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private register: RegisterService
  ) {}

  canActivate(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<true | UrlTree> {
    return this.auth.isUserLoggedIn().then((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        return this.router.parseUrl("/member");
      } else {
        const rid = childRoute.paramMap.get("rid");
        if (rid) {
          return this.register.checkResetLink(rid);
        }
        return this.router.parseUrl("/sign-in");
      }
    });
  }
}
