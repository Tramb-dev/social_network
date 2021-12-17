import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { map, Observable } from "rxjs";

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
  ): Observable<true | UrlTree> {
    console.log("global: ", state.url);
    return this.auth.isUserLoggedIn().pipe(
      map((isLoggedIn) => {
        console.log(isLoggedIn);
        if (isLoggedIn) {
          return this.router.parseUrl("/member/wall/" + this.user.me.uid);
        }
        return true;
      })
    );
  }
}
