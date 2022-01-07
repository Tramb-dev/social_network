import { Component, OnInit } from "@angular/core";

import { MessagingService } from "src/app/services/messaging.service";
import { UserService } from "src/app/services/user.service";

import { Discussion } from "src/app/interfaces/discussion";
import { map, zip } from "rxjs";

@Component({
  selector: "app-discussions-list",
  templateUrl: "./discussions-list.component.html",
  styleUrls: ["./discussions-list.component.scss"],
})
export class DiscussionsListComponent implements OnInit {
  discussions: Discussion[] = [];

  constructor(private msgSvc: MessagingService, private user: UserService) {}

  ngOnInit(): void {
    const discussions$ = this.msgSvc.getDiscussions();
    const friends$ = this.user.displayFriends();
    zip(discussions$, friends$)
      .pipe(
        map(([discussions, friends]) => {
          return discussions.map((discussion) => {
            discussion.users.forEach((user) => {
              if (user !== this.user.me.uid) {
                const currentFriend = friends.find(
                  (friend) => friend.uid === user
                );
                if (currentFriend) {
                  const name = `${currentFriend.firstName} ${currentFriend.lastName}`;
                  if (!discussion.authors) {
                    discussion.authors = [];
                  }
                  discussion.authors.push(name);
                }
              }
            });
            return discussion;
          });
        })
      )
      .subscribe((discussions) => (this.discussions = discussions));
  }

  goToDiscussion(dId: string) {
    this.msgSvc.getMessages(dId);
  }
}
