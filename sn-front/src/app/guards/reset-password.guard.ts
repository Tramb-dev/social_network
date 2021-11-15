import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";

import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class ResetPasswordGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<true | UrlTree> {
    const rid = childRoute.paramMap.get("rid");
    if (rid) {
      return true;
    }
    return this.auth.isUserLoggedIn().then((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        return this.router.parseUrl("/member");
      }
      return this.router.parseUrl("/sign-in");
    });
  }
}
