import { Component } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  userName: string;
  picture: string;
  isSmallScreen = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private user: UserService
  ) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((result) => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.isSmallScreen = true;
        } else {
          this.isSmallScreen = false;
        }
      });
    this.userName = user.me.firstName;
    this.picture = user.me.picture
      ? user.me.picture
      : "assets/images/default-user.jpg";
  }
}
