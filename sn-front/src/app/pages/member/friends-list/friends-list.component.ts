import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { combineLatest, Observable, Subscription, switchMap } from "rxjs";

import { UserService } from "src/app/services/user.service";
import { SnackBarService } from "src/app/services/snack-bar.service";
import { RecommendToComponent } from "src/app/components/member/recommend-to/recommend-to.component";

import { RandomUser } from "src/app/interfaces/user";
import { siteName } from "src/global-variable";

@Component({
  selector: "app-friends-list",
  templateUrl: "./friends-list.component.html",
  styleUrls: ["./friends-list.component.scss"],
})
export class FriendsListComponent implements OnInit, OnDestroy {
  friends: RandomUser[] = [];
  private userSubscription$: Subscription = Subscription.EMPTY;
  isMyList: boolean = false;

  constructor(
    private userSvc: UserService,
    private title: Title,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private snackBar: SnackBarService
  ) {
    title.setTitle("Liste de mes amis - " + siteName);
  }

  ngOnInit(): void {
    this.userSubscription$ = this.route.paramMap
      .pipe(
        switchMap((params) => {
          const uid = params.get("uid");
          return combineLatest([
            this.getFriendsList(uid),
            this.getFriendName(uid),
          ]);
        })
      )
      .subscribe((users) => {
        if (users[0]) {
          this.friends = users[0];
        }
        if (users[1].uid == this.userSvc.me.uid) {
          this.title.setTitle("Liste de mes amis - " + siteName);
          this.isMyList = true;
        } else {
          this.title.setTitle(
            `Liste des amis de ${users[1].firstName} ${users[1].lastName} - ${siteName}`
          );
          this.isMyList = false;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.userSubscription$) {
      this.userSubscription$.unsubscribe();
    }
  }

  private getFriendsList(uid: string | null): Observable<RandomUser[]> {
    if (!uid) {
      uid = this.userSvc.me.uid;
    }
    return this.userSvc.displayFriends(uid);
  }

  private getFriendName(uid: string | null): Observable<RandomUser> {
    if (!uid) {
      uid = this.userSvc.me.uid;
    }
    return this.userSvc.getUser(uid);
  }

  openRecommendModal(friendUid: string) {
    const friendsToDisplay = this.friends.filter(
      (friend) => friend.uid !== friendUid
    );
    const dialogRef = this.dialog.open(RecommendToComponent, {
      data: {
        friends: friendsToDisplay,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== "") {
        this.userSvc
          .recommendFriend(friendUid, result)
          .subscribe((response) => {
            if (response) {
              this.snackBar.presentSnackBar(
                "La recommendation a bien été envoyée",
                "snackBar-top",
                3000
              );
            }
          });
      }
    });
  }

  blockFriend(friendUid: string) {
    if (this.isMyList) {
      this.userSvc.removeFriend(friendUid).subscribe((currentUser) => {
        if (!currentUser.friends?.includes(friendUid)) {
          const index = this.friends.findIndex(
            (user) => user.uid === friendUid
          );
          this.friends.splice(index, 1);
        }
      });
    }
  }
}
