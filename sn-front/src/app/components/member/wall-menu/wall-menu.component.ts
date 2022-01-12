import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Observable, Subscription, switchMap, tap } from "rxjs";
import { Discussion } from "src/app/interfaces/discussion";

import { MessagingService } from "src/app/services/messaging.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-wall-menu",
  templateUrl: "./wall-menu.component.html",
  styleUrls: ["./wall-menu.component.scss"],
})
export class WallMenuComponent implements OnInit, OnDestroy {
  friendText = "";
  uid = this.userSvc.me.uid;
  me = this.userSvc.me.uid;
  private wallSubscription = Subscription.EMPTY;
  private privateDiscussion = Subscription.EMPTY;
  private discussions: Discussion[] = [];

  constructor(
    private userSvc: UserService,
    private route: ActivatedRoute,
    private msgSvc: MessagingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.wallSubscription = this.route.paramMap
      .pipe(
        tap((params) => {
          const wallId = params.get("wallId");
          this.changeText(wallId);
        }),
        switchMap<ParamMap, Observable<Discussion[]>>((params) =>
          this.msgSvc.getDiscussions()
        )
      )
      .subscribe((discussions) => {
        this.discussions = discussions;
      });
  }

  ngOnDestroy(): void {
    if (this.wallSubscription) {
      this.wallSubscription.unsubscribe();
    }
    if (this.privateDiscussion) {
      this.privateDiscussion.unsubscribe();
    }
  }

  goToDiscussion(): WallMenuComponent {
    this.privateDiscussion = this.msgSvc
      .getPrivateMessages(this.uid)
      .subscribe((discussion) => {
        if (discussion) {
          this.router.navigate(["/member/discussion", discussion.dId]);
        }
      });
    return this;
  }

  private changeText(wallId: string | null): WallMenuComponent {
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
    return this;
  }
}
