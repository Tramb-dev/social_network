import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";

import { UserService } from "src/app/services/user.service";

import { RandomUser } from "src/app/interfaces/user";
import { siteName } from "src/global-variable";

@Component({
  selector: "app-friends-list",
  templateUrl: "./friends-list.component.html",
  styleUrls: ["./friends-list.component.scss"],
})
export class FriendsListComponent implements OnInit {
  friends: RandomUser[] = [];

  constructor(private userSvc: UserService, private title: Title) {
    title.setTitle("Liste de mes amis - " + siteName);
  }

  ngOnInit(): void {
    this.userSvc.displayFriends().subscribe((friends) => {
      if (friends) {
        this.friends = friends;
      }
    });
  }

  blockFriend(friendUid: string) {
    this.userSvc.removeFriend(friendUid).subscribe((currentUser) => {
      if (!currentUser.friends?.includes(friendUid)) {
        const index = this.friends.findIndex((user) => user.uid === friendUid);
        this.friends.splice(index, 1);
      }
    });
  }
}
