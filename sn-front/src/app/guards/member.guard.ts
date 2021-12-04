import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from "@angular/router";

import { AuthService } from "../services/auth.service";

import { RightsLevels } from "../interfaces/auth";

@Injectable({
  providedIn: "root",
})
export class MemberGuard implements CanActivate, CanActivateChild, CanLoad {
  userRights = 2;

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let url: string = state.url;
    if (this.auth.isUserLoggedIn()) {
      if (this.auth.getRightsLevel() <= RightsLevels.MEMBER) {
        return true;
      }
    }
    this.redirectUser(url);
    return false;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let url: string = state.url;
    console.log("Url: " + url);
    if (this.auth.isUserLoggedIn()) {
      if (this.auth.getRightsLevel() <= RightsLevels.MEMBER) {
        return true;
      }
    }
    this.redirectUser(url);
    return false;
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    return this.auth.isUserLoggedIn();
  }

  private redirectUser(url: string): Promise<boolean> {
    this.auth.setRedirectUrl(url);
    return this.router.navigate([this.auth.getLoginUrl()]);
  }
}
