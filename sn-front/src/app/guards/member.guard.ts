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
  ): Promise<boolean> {
    let url: string = state.url;
    return this.auth.isUserLoggedIn().then((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        return this.auth.getRightsLevel().then((rightsLevels: RightsLevels) => {
          if (rightsLevels === RightsLevels.ADMIN) {
            return true;
          }
          this.redirectUser(url);
          return false;
        });
      }
      this.redirectUser(url);
      return false;
    });
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    let url: string = state.url;
    console.log("Url: " + url);
    return this.auth.isUserLoggedIn().then((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        return this.auth.getRightsLevel().then((rightsLevel: RightsLevels) => {
          if (rightsLevel <= RightsLevels.MEMBER) {
            return true;
          }
          return false;
        });
      }
      this.auth.setRedirectUrl(url);
      return this.router.navigate(["/sign-in"]);
    });
  }

  canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
    return this.auth.isUserLoggedIn().then((isLogged) => isLogged);
  }

  redirectUser(url: string) {
    this.auth.setRedirectUrl(url);
    this.router.navigate(["/sign-in"]);
  }
}
