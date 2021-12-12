import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";

import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";

@Injectable({
  providedIn: "root",
})
export class GlobalsGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private user: UserService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): UrlTree | true {
    if (this.auth.isUserLoggedIn()) {
      return this.router.parseUrl("/member/wallId/" + this.user.getUser().uid);
    }
    return true;
  }
}
