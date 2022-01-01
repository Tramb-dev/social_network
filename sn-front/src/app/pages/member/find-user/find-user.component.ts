import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";

import { UserService } from "src/app/services/user.service";

import { RandomUser } from "src/app/interfaces/user";
import { siteName } from "src/global-variable";

@Component({
  selector: "app-find-user",
  templateUrl: "./find-user.component.html",
  styleUrls: ["./find-user.component.scss"],
})
export class FindUserComponent implements OnInit {
  users: RandomUser[] = [];
  filteredUsers: RandomUser[] = [];

  constructor(private userSvc: UserService, private title: Title) {
    title.setTitle("Liste des utilisateurs - " + siteName);
  }

  ngOnInit(): void {
    this.userSvc.displayUsers().subscribe((users) => {
      if (users) {
        users.map((user) => {
          if (this.userSvc.me.sendedFriendRequests?.includes(user.uid)) {
            user.requested = true;
          } else {
            user.requested = false;
          }
          if (this.userSvc.me.receivedFriendRequests?.includes(user.uid)) {
            user.incomingRequest = true;
          } else {
            user.incomingRequest = false;
          }
        });
        this.users = users;
        this.filteredUsers = users;
      }
    });
  }

  filter(event: string) {
    this.filteredUsers = this.users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(event) ||
        user.lastName.toLowerCase().includes(event)
    );
  }

  onFriend(friendUid: string): FindUserComponent {
    this.userSvc.sendFriendRequest(friendUid).subscribe((currentUser) => {
      if (currentUser.sendedFriendRequests?.includes(friendUid)) {
        const index = this.users.findIndex((user) => user.uid === friendUid);
        this.users[index].requested = true;
      }
    });
    return this;
  }

  onAccept(friendUid: string): FindUserComponent {
    this.userSvc.acceptFriendRequest(friendUid).subscribe((currentUser) => {
      if (currentUser.friends?.includes(friendUid)) {
        const index = this.users.findIndex((user) => user.uid === friendUid);
        this.users[index].requested = false;
        this.users[index].incomingRequest = false;
        this.users[index].alreadyFriend = true;
      }
    });
    return this;
  }
}
