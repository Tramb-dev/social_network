import { Component, OnInit } from "@angular/core";
import { RandomUser } from "src/app/interfaces/user";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-find-user",
  templateUrl: "./find-user.component.html",
  styleUrls: ["./find-user.component.scss"],
})
export class FindUserComponent implements OnInit {
  users: RandomUser[] = [];

  constructor(private userSvc: UserService) {}

  ngOnInit(): void {
    this.userSvc.displayUsers().subscribe((users) => {
      if (users) {
        users.map((user) => {
          if (!user.picture) {
            user.picture = "assets/images/default-user.jpg";
          }
        });
        this.users = users;
      }
    });
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
}
