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
export class GlobalsGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<UrlTree | true> {
    return this.auth.isUserLoggedIn().then((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        return this.router.parseUrl("/member");
      }
      return true;
    });
  }
}
