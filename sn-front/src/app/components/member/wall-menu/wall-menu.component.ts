import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";

import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-wall-menu",
  templateUrl: "./wall-menu.component.html",
  styleUrls: ["./wall-menu.component.scss"],
})
export class WallMenuComponent implements OnInit, OnDestroy {
  friendText: string = "";
  uid: string = this.userSvc.me.uid;
  private wallSubscription: Subscription = Subscription.EMPTY;

  constructor(private userSvc: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.wallSubscription = this.route.paramMap.subscribe((params) => {
      const wallId = params.get("wallId");
      if (wallId) {
        this.uid = wallId;
        if (wallId !== this.userSvc.me.uid) {
          this.friendText = "Voir ses amis";
        } else {
          this.friendText = "Voir mes amis";
        }
      } else {
        this.friendText = "Voir mes amis";
      }
    });
  }

  ngOnDestroy(): void {
    if (this.wallSubscription) {
      this.wallSubscription.unsubscribe();
    }
  }
}
